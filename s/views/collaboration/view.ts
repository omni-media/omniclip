import {TemplateResult, html} from "@benev/slate"

import {styles} from "./styles.js"
import loadingSvg from "../../icons/loading.svg.js"
import exitSvg from "../../icons/gravity-ui/exit.svg.js"
import crownSvg from "../../icons/remix-icon/crown.svg.js"
import xMarkSvg from "../../icons/gravity-ui/x-mark.svg.js"
import personSvg from "../../icons/gravity-ui/person.svg.js"
import slidersSvg from "../../icons/gravity-ui/sliders.svg.js"
import warningSvg from "../../icons/gravity-ui/warning.svg.js"
import {collaboration, shadow_view} from "../../context/context.js"
import collaborateSvg from "../../icons/gravity-ui/collaborate.svg.js"

export const CollaborationManager = shadow_view((use) => () => {
	use.styles(styles)

	const [joiningOrCreatingInProgress, setJoiningOrCreatingInProgress] = use.state(false)
	const [sessionError, setSessionError] = use.state<unknown>("")
	const [inviteID, setInviteID] = use.state("")
	const [isModalOpened, setIsModalOpened] = use.state(false)
	const [hostInviteID, setHostInviteID] = use.state("")
	const [isHost, setIsHost] = use.state(!!collaboration.host)
	const [isClient, setIsClient, getIsClient] = use.state(!!collaboration.client)
	const [numberOfCollaborators, setNumberOfCollaborators] = use.state(collaboration.numberOfConnectedUsers)
	const [allow, setAllow] = use.state(true)
	setIsClient(!!collaboration.client)

	use.mount(() => {
		const dispose2 = collaboration.onChange(() => use.rerender())
		const locker = collaboration.onLock((v) => setAllow(v))
		const dispose = collaboration.onNumberOfClientsChange(number => setNumberOfCollaborators(number))
		const dispose1 = collaboration.onDisconnect(() => {
			setIsHost(false)
			setHostInviteID("")
			setNumberOfCollaborators(0)
			if(getIsClient()) {
				setIsClient(false)
				window.location.hash = "#/editor"
			}
		})
		return () => {
			dispose(); dispose1(); dispose2(); locker();
			if(isClient || isHost) {
				collaboration.disconnect()
			}
		}
	})

	const createRoom = async () => {
		setJoiningOrCreatingInProgress(true)
		try {
			const host = await collaboration.createRoom()
			setIsHost(true)
			setHostInviteID(host.invite)
			setJoiningOrCreatingInProgress(false)
		} catch(e) {
			setSessionError(e)
			setJoiningOrCreatingInProgress(false)
		}
	}

	const joinRoom = async () => {
		setJoiningOrCreatingInProgress(true)
		try {
			await collaboration.joinRoom(inviteID)
			setJoiningOrCreatingInProgress(false)
			setIsClient(true)
		} catch(e) {
			collaboration.initiatingProject = false
			setSessionError(e)
			setJoiningOrCreatingInProgress(false)
		}
	}

	const noSession = !isHost && !isClient

	const renderHostModal = () => {
		return renderModal(html`
			<h3 class=host-title>You are <span class=host>${crownSvg} host</span> of a collaborative session</h3>
			<span>Invite code: ${hostInviteID}</span>
			<span class=lock>Lock session
				<label class="switch">
					<input @change=${() => collaboration.toggleLock()} type="checkbox" ?data-checked=${!allow}>
					<span class="slider round"></span>
				</label>
			</span>
			<span class=close>Close session <button @click=${() => collaboration.disconnect()}>Close</button></span>
			<div class=peers>
				<h4>Collaborators:</h4>
				${numberOfCollaborators > 0
					? [...collaboration.connectedClients.entries()].map(
						([id, client]) => html`
						<div class=peer>
							<span>${personSvg} ${client.id}</span>
							<button @click=${() => collaboration.kick(id)} class=kick>kick</button>
							<button class=ban>ban</button>
						</div>
					`
				) : html`<span>No collaborators connected</span>`}
			</div>
		`)
	}

	const renderNoSessionModal = () => {
		return renderModal(
			html`
			<div>
				<h3>Create Session</h3>
				<button class="start" @click=${createRoom}>Start session</button>
			</div>
			<div>
				<h3>Join Session</h3>
				<input class="code-input" placeholder="Enter Invite Code" @input=${(e: InputEvent) => setInviteID((e.target as HTMLInputElement).value)}>
				<button ?disabled=${inviteID === ""} class="join" @click=${joinRoom}>Join</button>
			</div>
			`
		)
	}

	const renderModal = (content: TemplateResult): TemplateResult => {
		return html`
			<div id="collaboration-modal" ?data-hidden=${!isModalOpened} class="modal">
				<div class=flex>
					<h3 class=title>${collaborateSvg} Collaboration</h3>
					<button @click=${() => setIsModalOpened(false)} class="close-modal">${xMarkSvg}</button>
				</div>
				${joiningOrCreatingInProgress
					? html`<span class=creating>Session loading ${loadingSvg}</span>`
					: sessionError === ""
						? content
						: html`
							<span class=error>${warningSvg} error joining or creating session</span>
							<span class=reason>reason: <span>${sessionError}</span></span>
							<button @click=${() => setSessionError("")} class="renew">renew</button>
							`
				}
			</div>
		`
	}

	return html`
		${noSession
			? html`
				<button class="collaborate" @click=${() => setIsModalOpened(true)}>Collaborate ${collaborateSvg}</button>
				${renderNoSessionModal()}
			`
			: html`
				<div class=live>
					${isHost
						? html`<span @click=${() => setIsModalOpened(true)} class=settings>${slidersSvg}</span>`
						: html`<span @click=${() => collaboration.disconnect()} class=exit>${exitSvg}</span>`
					}
					<span class=kind>
						${isHost ? html`${crownSvg} Host` : html`${personSvg} Client`}
					</span>
					<div class=people>
						${numberOfCollaborators > 0 ? html`<i class="pulse green"></i>` : html`<i class="pulse gray"></i>`}
						${collaborateSvg}${numberOfCollaborators}
					</div>
					${isHost ? renderHostModal() : null}
				</div>
			`}
	`
})
