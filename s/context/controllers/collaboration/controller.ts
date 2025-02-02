import {pub} from "@benev/slate"
import Sparrow, {Connection, SparrowHost, SparrowJoin} from "sparrow-rtc"

import {Actions} from "../../actions.js"
import {omnislate} from "../../context.js"
import {Compressor} from "./parts/compressor.js"
import {FileHandler} from "./parts/file-handler.js"
import {OPFSManager} from "./parts/opfs-manager.js"
import {showToast} from "../../../utils/show-toast.js"
import {MessageHandler} from "./parts/message-handler.js"
import {AnyMedia} from "../../../components/omni-media/types.js"

export class Collaboration {
	host: SparrowHost | null = null
	client: SparrowJoin | null = null
	connectedClients = new Map<string, Connection>()
	#allow = true

	#fileHandler: FileHandler
	#messageHandler: MessageHandler

	onNumberOfClientsChange = pub<number>()
	numberOfConnectedUsers = 0

	onFileProgress = pub<{hash: string, progress: number}>()
	onDisconnect = pub()
	onLock = pub<boolean>()
	onChange = pub()

	compressor = new Compressor(this)
	opfs: OPFSManager

	isJoining = false
	initiatingProject = false

	constructor() {
		this.#fileHandler = new FileHandler(this)
		this.opfs = new OPFSManager(this.#fileHandler)
		this.#messageHandler = new MessageHandler(this, this.#fileHandler)
	}

	async createRoom() {
		const host = await Sparrow.host({
			allow: async() => this.#allow,
			welcome: prospect => connection => {
				console.log(`peer connected: ${connection.id}`)
				showToast("A collaborator joined your session", "info")

				this.connectedClients.set(connection.id, connection)
				this.onNumberOfClientsChange.publish(this.connectedClients.size)
				this.numberOfConnectedUsers = this.connectedClients.size

				connection.cable.reliable.send(
					JSON.stringify({initState: omnislate.context.state, type: "init"})
				)
				this.connectedClients.forEach(c => c.cable.reliable.send(JSON.stringify({type: "clients-change", number: this.connectedClients.size})))
				connection.cable.reliable.onmessage = this.#messageHandler.handleMessage.bind(
					this.#messageHandler,
					connection
				)
				this.onChange.publish(true)

				return () => {
					this.connectedClients.delete(connection.id)
					this.onNumberOfClientsChange.publish(this.connectedClients.size)
					this.numberOfConnectedUsers = this.connectedClients.size
					this.connectedClients.forEach(c => c.cable.reliable.send(JSON.stringify({type: "clients-change", number: this.connectedClients.size})))
					showToast("One of your collaborators has left the session.", "info")
					this.onChange.publish(true)
				}
			},
			closed: () => {
				this.onDisconnect.publish(true)
				showToast("Project session ended. Collaborators are no longer connected.", "info")
				this.onChange.publish(true)
			}
		})
		// start compressing all videos on timeline
		this.compressor.compressAllVideos(omnislate.context.state)
		this.host = host
		this.onChange.publish(true)
		return host
	}

	async joinRoom(inviteId: string) {
		this.isJoining = true
		this.initiatingProject = true
		const client = await Sparrow.join({
			invite: inviteId,
			disconnected: () => {
				this.numberOfConnectedUsers = 0
				this.onDisconnect.publish(true)
				showToast("You’ve been disconnected from host's project.", "info")
				this.onChange.publish(true)
			},
			welcome: prospect => connection => {
				connection.cable.reliable.onmessage =
					this.#messageHandler.handleMessage.bind(
					this.#messageHandler,
					connection
				)
				this.onChange.publish(true)
				return () => {}
			},
		})
		this.client = client
		client.connection.cable.reliable.onmessage = this.#messageHandler.handleMessage.bind(
			this.#messageHandler,
			client.connection
		)
		this.isJoining = false
		this.onChange.publish(true)
		return client
	}

	broadcastAction(actionType: keyof Actions, payload: any) {
		this.#messageHandler.broadcastAction(actionType, payload)
	}

	broadcastMedia(media: AnyMedia) {
		this.#fileHandler.broadcastMedia(media)
	}

	disconnect() {
		try {
			if(this.client) {
				this.client.connection.disconnect()
				this.client.close()
			} else if(this.host) {
				this.connectedClients.forEach(c => c.disconnect())
				this.host.close()
			}
		} catch(e) {
			console.log(e)
		}
		this.client = null
		this.host = null
	}

	cleanup() {
		// Cleanup logic here
	}

	kick(peerID: string) {
		const client = this.connectedClients.get(peerID)
		if(client) {
			client.disconnect()
		}
	}

	ban(peerID: string) {}

	toggleLock() {
		// lock session so no one else can join
		if(this.host) {
			this.#allow = !this.#allow
			this.onLock.publish(this.#allow)
		}
	}

	requestOriginalVideoFile(requestedFileHash: string) {
		this.#fileHandler.requestOriginalVideoFile(requestedFileHash)
	}

	get filesInProgress() {
		return this.#fileHandler.filesInProgress
	}

	get filesMetada() {
		return this.#fileHandler.filesMetadata
	}
}
