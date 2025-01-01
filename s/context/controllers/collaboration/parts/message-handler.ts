import {Connection} from "sparrow-rtc"

import {State} from "../../../types.js"
import {Actions} from "../../../actions.js"
import {omnislate} from "../../../context.js"
import {FileHandler} from "./file-handler.js"
import {Collaboration} from "../controller.js"
import {showToast} from "../../../../utils/show-toast.js"
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

type ReceivedMessage = ReceivedFileChunk | ReceivedAction<keyof Actions> | MissingFile
	| {type: "init", initState: State} | {type: "newMedia"} | {type: "clients-change", number: number}

export class MessageHandler {
	constructor(private actions: Actions, private collaboration: Collaboration, private fileHandler: FileHandler) {}

	handleMessage(connection: Connection, event: MessageEvent<any>) {
		// Delegate file-related messages to onFileChunk
		this.fileHandler.onFileChunk(
			event,
			64,
			async (hash, file) => {
				console.log(`File received: ${hash}`, file)
				// Broadcast to other clients (if host)
				if (this.collaboration.host) {
					omnislate.context.controllers.media.import_file(file)
					this.fileHandler.syncMedia({file, hash}, connection)
				} else {
					// Otherwise, just import the file locally for the client
					omnislate.context.controllers.media.import_file(file)
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
					this.actions[parsed.actionType](...parsed.payload, true)
					if(this.collaboration.host) {
						this.broadcastAction(parsed.actionType, parsed.payload)
					}
					break
				case "init":
					this.#handleInitMessage(parsed, connection)
					break
				case "missing":
					this.#handleMissingFiles(parsed.missing, connection)
					break
				case "clients-change":
					this.collaboration.onNumberOfClientsChange.publish(parsed.number)
					break
				default:
					console.warn("Unknown message type", parsed.type)
			}
		}
	}

	async #handleInitMessage(parsed: { type: "init"; initState: State }, connection: Connection) {
		// Apply the received state
		this.actions.set_incoming_historical_state_webrtc(parsed.initState)
		this.actions.set_incoming_non_historical_state_webrtc(parsed.initState)

		showToast(`You're now collaborating on "${parsed.initState.projectName}"`, "info")
		// Identify missing files
		const missing = await this.fileHandler.getMissingFiles(parsed.initState)

		// Request missing files from the host
		connection.cable.reliable.send(JSON.stringify({ type: "missing", missing }))
	}

	#handleMissingFiles(missing: string[], connection: Connection) {
		missing.forEach(async hash => {
			const media = omnislate.context.controllers.media.get(hash)
			if (media) {
				this.fileHandler.sendFile(media.file, media.hash, connection.cable.reliable)
			}
		})
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
