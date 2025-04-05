import {Connection} from "sparrow-rtc"

import {Actions} from "../../../actions.js"
import {omnislate} from "../../../context.js"
import {FileHandler} from "./file-handler.js"
import {Collaboration} from "../controller.js"
import {showToast} from "../../../../utils/show-toast.js"
import {ImageEffect, State, VideoEffect} from "../../../types.js"
import {AnyMedia} from "../../../../components/omni-media/types.js"

type ReceivedAction<T extends keyof Actions> = {
	actionType: T
	payload: Parameters<Actions[T]>
	type: "action"
}

type ReceivedFileChunk = {
	type: "chunk"
	file: AnyMedia
	hash: string
}

type MissingFile = {
	type: "missing"
	missing: string[] // hashes of missing files
}

type GetOriginalFile = {
	type: "get-original-file"
	hash: string
}

type ReceivedMessage = ReceivedFileChunk | ReceivedAction<keyof Actions> | MissingFile
	| {type: "init", initState: State} | {type: "newMedia"} | {type: "clients-change", number: number} | GetOriginalFile

// Utility to handle a single action by type
function handleAction<T extends keyof Actions>(actionType: T, payload: ActionParams<T>, host: boolean, broadcastAction: Function, connection: Connection) {
	// 1) Look up the specialized handler, or fall back to default
	// somtimes action is inpure in the sense that it needs to be run through controller
	// to create some side effect eg. create object on canvas
	const specializedHandler = (actionHandlers as any)[actionType]
	if (specializedHandler) {
		specializedHandler(payload)
	} else {
		actionHandlers.default(actionType, payload)
	}

	// 2) If host, re-broadcast
	if (host) {
		broadcastAction(actionType, payload, connection)
	}
}

export class MessageHandler {
	constructor(private collaboration: Collaboration, private fileHandler: FileHandler) {}

	async handleMessage(connection: Connection, event: MessageEvent<any>) {
		// 1) First, delegate file-related messages to onFileChunk
		this.fileHandler.onFileChunk(
			connection,
			event,
			64,
			async (hash, file, proxy) => {
				//console.log(`File received: ${hash}`, file);
				const mediaController = omnislate.context.controllers.media;

				// If host, broadcast to other clients
				if (this.collaboration.host) {
					await mediaController.syncFile(file, hash, proxy, true)
					const media = mediaController.get(hash)!
					if (proxy) {
						this.fileHandler.broadcastMedia(media, connection, true)
					}
				} else {
					// Otherwise, just import the file locally
					if (this.collaboration.client) {
						mediaController.syncFile(file, hash, proxy)
					}
				}
			},
			(hash, received, total) => {
				//console.log(`Progress for file ${hash}: ${(received / total) * 100}%`)
			}
		)

		// 2) Process non-file messages
		if (typeof event.data === "string") {
			const parsed = JSON.parse(event.data) as ReceivedMessage

			switch (parsed.type) {
				case "action":
					handleAction(
						parsed.actionType,
						parsed.payload as any,
						!!this.collaboration.host,
						this.broadcastAction.bind(this),
						connection
					)
					// update canvas objects in case action updated effect's position in state
					omnislate.context.controllers.compositor.update_canvas_objects(omnislate.context.state)
					break

				case "init":
					await this.#handleInitMessage(parsed, connection)
					break

				case "missing":
					this.fileHandler.handleMissingFiles(parsed.missing, connection)
					break

				case "clients-change":
					this.collaboration.numberOfConnectedUsers = parsed.number
					this.collaboration.onNumberOfClientsChange.publish(parsed.number)
					break

				case "get-original-file": {
					const media = omnislate.context.controllers.media.get(parsed.hash)
					if (media) {
						this.fileHandler.sendFile(
							media.file,
							media.hash,
							connection.cable.reliable,
							media.file.size
						)
					}
					break
				}

				default:
					console.warn("Unknown message type", parsed.type)
			}
		}
	}

	async #waitForContextChange(parsedProjectId: string) {
		return new Promise(resolve => {
			const interval = setInterval(() => {
				try {
					if (
						omnislate?.context?.state?.projectId
						=== parsedProjectId
					) {
						clearInterval(interval)
						resolve(true)
					}
				}
				catch (err) {
					// ignore and keep checking
				}
			}, 10)
		})
	}

	async #handleInitMessage(parsed: { type: "init"; initState: State }, connection: Connection) {
		window.location.hash = `#/editor/${parsed.initState.projectId}` // component will reset
		await this.#waitForContextChange(parsed.initState.projectId)
		// Apply the received state
		omnislate.context.actions.set_incoming_historical_state_webrtc(parsed.initState)
		omnislate.context.actions.set_incoming_non_historical_state_webrtc(parsed.initState)
		omnislate.context.controllers.compositor.recreate(parsed.initState, omnislate.context.controllers.media)
		this.collaboration.initiatingProject = false
		showToast(`You're now collaborating on "${parsed.initState.projectName}"`, "info")
		// Identify missing files
		const missing = await this.fileHandler.getMissingFiles(parsed.initState)

		// Request missing files from the host
		connection.cable.reliable.send(JSON.stringify({ type: "missing", missing: [...new Set(missing)] }))
	}

	broadcastAction(actionType: keyof Actions, payload: any, connection?: Connection) {
		if (this.collaboration.host) {
			this.collaboration.connectedClients.forEach(client => {
				if (!connection || client !== connection) {
					client.cable.reliable.send(
						JSON.stringify({ actionType, payload, type: "action" })
					)
				}
			})
		}

		if (this.collaboration.client) {
			this.collaboration.client.connection.cable.reliable.send(
				JSON.stringify({ actionType, payload, type: "action" })
			)
		}
	}
}

type ActionHandlers = {
	[K in keyof Actions]?: (
		payload: PopLast<Parameters<Actions[K]>>
	) => void
} & {
	default: (actionType: keyof Actions, payload: any[]) => void
}

type PopLast<T extends any[]> = T extends [...infer Rest, any?] ? Rest : T
type ActionParams<T extends keyof Actions> = PopLast<Parameters<Actions[T]>>

const actionHandlers: ActionHandlers = {
	clear_animations() {
		omnislate.context.controllers.compositor.managers.animationManager.clearAnimations(true)
		omnislate.context.controllers.compositor.managers.transitionManager.clearTransitions(true)
	},

	clear_project() {
		omnislate.context.clear_project(true)
	},

	add_filter(payload) {
		omnislate.context.actions.add_filter(...payload, { omit: true })
		const [filter] = payload
		const effect = omnislate.context.state.effects.find(e => e.id === filter.targetEffectId) as VideoEffect | ImageEffect
		if (effect) {
			omnislate.context.controllers.compositor.managers.filtersManager
				.addFilterToEffect(effect, filter.type, true)
		}
	},

	remove_filter(payload) {
		omnislate.context.actions.remove_filter(...payload, { omit: true })
		const [effect, type] = payload
		if (effect) {
			omnislate.context.controllers.compositor.managers.filtersManager
				.removeFilterFromEffect(effect, type, true)
		}

	},

	add_video_effect(payload) {
		const [effect] = payload
		if (!effect) return

		const file = omnislate.context.controllers.media.get(effect.file_hash)
		if (file) {
			omnislate.context.controllers.compositor.managers.videoManager
				.add_video_effect(effect, file.file, true)
		}

		omnislate.context.actions.add_video_effect(...payload, { omit: true })
	},

	add_transition(payload) {
		omnislate.context.controllers.compositor.managers.transitionManager.selectTransition(...payload, true).apply(omnislate.context.state)
		omnislate.context.actions.add_transition(...payload, { omit: true })
	},

	update_transition(payload) {
		omnislate.context.controllers.compositor.managers.transitionManager.update(...payload)
	},

	remove_transition(payload) {
		omnislate.context.controllers.compositor.managers.transitionManager.removeTransition(...payload, true)
		omnislate.context.actions.remove_transition(...payload, { omit: true })
	},

	// "default" handler for any action that doesn't require additional side effects
	default(actionType, payload) {
		// For purely updating state with no ephemeral controller logic:
		// @ts-ignore
		omnislate.context.actions[actionType](...payload, { omit: true })
	},
}
