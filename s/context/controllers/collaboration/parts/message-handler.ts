import {Connection} from "sparrow-rtc"

import {State} from "../../../types.js"
import {Actions} from "../../../actions.js"
import {omnislate} from "../../../context.js"
import {FileHandler} from "./file-handler.js"
import {Collaboration} from "../controller.js"
import {showToast} from "../../../../utils/show-toast.js"
import {AnyMedia, VideoFile} from "../../../../components/omni-media/types.js"

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

type ReceivedMessage = ReceivedFileChunk | ReceivedAction<keyof Actions> | MissingFile
	| {type: "init", initState: State} | {type: "newMedia"} | {type: "clients-change", number: number}

export class MessageHandler {
	constructor(private collaboration: Collaboration, private fileHandler: FileHandler) {}

	handleMessage(connection: Connection, event: MessageEvent<any>) {
		// Delegate file-related messages to onFileChunk
		this.fileHandler.onFileChunk(
			event,
			64,
			async (hash, file) => {
				console.log(`File received: ${hash}`, file)
				const mediaController = omnislate.context.controllers.media
				// Broadcast to other clients (if host)
				if (this.collaboration.host) {
					await mediaController.syncFile(file, hash)
					const media = mediaController.get(hash) as VideoFile
					this.fileHandler.broadcastMedia(media, connection)
				} else {
					// Otherwise, just import the file locally for the client
					if(this.collaboration.client) {
						mediaController.syncFile(file, hash)
					}
				}
			},
			(hash, received, total) => {
				console.log(`Progress for file ${hash}: ${(received / total) * 100}%`)
			}
		)

		// Process non-file messages
		if (typeof event.data === "string") {
			const parsed = JSON.parse(event.data) as ReceivedMessage
			switch (parsed.type) {
				case "action":
					//@ts-ignore
					omnislate.context.actions[parsed.actionType](...parsed.payload, true)
					if(this.collaboration.host) {
						this.broadcastAction(parsed.actionType, parsed.payload, connection)
					}
					break
				case "init":
					this.#handleInitMessage(parsed, connection)
					break
				case "missing":
					this.fileHandler.handleMissingFiles(parsed.missing, connection)
					break
				case "clients-change":
					this.collaboration.numberOfConnectedUsers = parsed.number
					this.collaboration.onNumberOfClientsChange.publish(parsed.number)
					break
				default:
					console.warn("Unknown message type", parsed.type)
			}
		}
	}

	async #handleInitMessage(parsed: { type: "init"; initState: State }, connection: Connection) {
		// Apply the received state
		omnislate.context.actions.set_incoming_historical_state_webrtc(parsed.initState)
		omnislate.context.actions.set_incoming_non_historical_state_webrtc(parsed.initState)

		showToast(`You're now collaborating on "${parsed.initState.projectName}"`, "info")
		// Identify missing files
		const missing = await this.fileHandler.getMissingFiles(parsed.initState)

		// Request missing files from the host
		connection.cable.reliable.send(JSON.stringify({ type: "missing", missing }))
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
