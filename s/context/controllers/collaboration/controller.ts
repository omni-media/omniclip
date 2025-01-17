import {generate_id, pub} from "@benev/slate"
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

	onDisconnect = pub()
	onLock = pub<boolean>()

	compressor = new Compressor(this)
	opfs: OPFSManager

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

				const id = generate_id()
				this.connectedClients.set(id, connection)
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

				return () => {
					this.connectedClients.delete(id)
					this.onNumberOfClientsChange.publish(this.connectedClients.size)
					this.numberOfConnectedUsers = this.connectedClients.size
					this.connectedClients.forEach(c => c.cable.reliable.send(JSON.stringify({type: "clients-change", number: this.connectedClients.size})))
					showToast("One of your collaborators has left the session.", "info")
				}
			},
			closed: () => {
				this.onDisconnect.publish(true)
				showToast("Project session ended. Collaborators are no longer connected.", "info")
			}
		})
		// start compressing all videos on timeline
		this.compressor.compressAllVideos(omnislate.context.state)
		this.host = host
		return host
	}

	async joinRoom(inviteId: string) {
		const client = await Sparrow.join({
			invite: inviteId,
			disconnected: () => {
				this.numberOfConnectedUsers = 0
				this.onDisconnect.publish(true)
				showToast("You’ve been disconnected from host's project.", "info")
			},
			welcome: prospect => connection => {
				connection.cable.reliable.onmessage =
					this.#messageHandler.handleMessage.bind(
					this.#messageHandler,
					connection
				)
				return () => {}
			},
		})
		this.client = client
		client.connection.cable.reliable.onmessage = this.#messageHandler.handleMessage.bind(
			this.#messageHandler,
			client.connection
		)
		return client
	}

	broadcastAction(actionType: keyof Actions, payload: any) {
		this.#messageHandler.broadcastAction(actionType, payload)
	}

	broadcastMedia(media: AnyMedia) {
		this.#fileHandler.broadcastMedia(media)
	}

	disconnect() {
		if(this.client) {
			this.client.connection.disconnect()
			this.client.close()
		} else if(this.host) {
			this.connectedClients.forEach(c => c.disconnect())
			this.host.close()
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

}
