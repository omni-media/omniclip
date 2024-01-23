import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Video} from "./types.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import binSvg from "../../icons/gravity-ui/bin.svg.js"
import {shadow_component} from "../../context/slate.js"

export const OmniMedia = shadow_component({styles}, use => {
	const media_controller = use.context.controllers.media
	const timeline_actions = use.context.actions.timeline_actions
	const [media, setMedia] = use.state<Video[]>([])

	use.setup(() => {
		get_imported_files()
		return () => {}
	})
	
	function get_imported_files() {
		use.context.request.onsuccess = async (e) => {
			const target = e.target as IDBRequest
			const database = target.result as IDBDatabase
			const imported_files = await media_controller.get_imported_files(database)
			const videos = media_controller.create_videos_from_video_files(imported_files)
			setMedia(videos)
		}
	}

	const import_file = async () => {
		const imported_file = await media_controller.import_file(use.context.request.result)
		const video_file = media_controller.create_videos_from_video_files([imported_file])
		setMedia([...media, ...video_file])
	}

	const delete_file = async (hash: string) => {
		const resolved = await media_controller.delete_file(use.context.request.result, hash)
		if(resolved) {
			const filtered = media.filter(a => a.hash !== hash)
			setMedia(filtered)
		}
	}

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
		<button @click=${import_file}>IMPORT FILE</button>
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
						<div @click=${() => delete_file(m.hash)} class="delete-btn">${binSvg}</div>
					</div>
					<span class="media-name">${m.file.name}</span>
				</div>
			`)}
		</div>
	`
})

