import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Video} from "./types.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import binSvg from "../../icons/gravity-ui/bin.svg.js"
import {shadow_component} from "../../context/slate.js"

export const OmniMedia = shadow_component({styles}, use => {
	const media_controller = use.context.controllers.media
	const timeline_actions = use.context.actions.timeline_actions
	const [media, setMedia, getMedia] = use.state<Video[]>([])

	use.setup(() => {
		const unsub = media_controller.on_media_change((change) => {
			if(change.action === "added") {
				const video_files = media_controller.create_videos_from_video_files(change.files)
				setMedia([...getMedia(), ...video_files])
			}
			if(change.action === "removed") {
				change.files.forEach(file => {
					const filtered = getMedia().filter(a => a.hash !== file.hash)
					setMedia(filtered)
				})
			}
		})
		return () => unsub()
	})

	const video_on_pointer = {
		enter(video: HTMLVideoElement) {
			video.play()
		},
		leave(video: HTMLVideoElement) {
			video.pause()
			video.currentTime = 0
		}
	}

	return html`
		<button class="import-btn" @click=${() => media_controller.import_file()}>Import media files</button>
		<div class="media">
			${media.map(m => html`
				<div
					@pointerenter=${() => video_on_pointer.enter(m.element)}
					@pointerleave=${() => video_on_pointer.leave(m.element)}
					class="box"
				>
					<div class="media-element">
						${m.element}
						<div @click=${() => timeline_actions.add_video_effect(m, use.context.controllers.compositor)} class="add-btn">${addSvg}</div>
						<div @click=${() => media_controller.delete_file(m)} class="delete-btn">${binSvg}</div>
					</div>
					<span class="media-name">${m.file.name}</span>
				</div>
			`)}
		</div>
	`
})

