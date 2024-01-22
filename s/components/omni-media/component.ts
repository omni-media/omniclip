import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {ImportedFile, Media} from "./types.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/slate.js"

interface MediaAsset {
	media: HTMLVideoElement
	file: ImportedFile
}

export const OmniMedia = shadow_component({styles}, use => {
	const media = use.context.controllers.media
	const raw_media = use.state<Media[]>([{type: "Audio", uri: ""}])
	const [mediaAssets, setMediaAssets] = use.state<MediaAsset[]>([])

	use.setup(() => {
		get_imported_files()
		return () => {}
	})
	
	const get_imported_files = () => {
		use.context.request.onsuccess = async (e) => {
			const target = e.target as IDBRequest
			const database = target.result as IDBDatabase
			const imported_files = await media.get_imported_files(database)
			const videos = media.create_videos_from_video_files(imported_files)
			setMediaAssets(videos)
		}
	}

	const import_file = async () => {
		const imported_file = await media.import_file(use.context.request.result)
		const video = media.create_videos_from_video_files([imported_file])
		setMediaAssets([...mediaAssets, ...video])
	}

	const delete_file = async (asset: {media: HTMLVideoElement, file: ImportedFile}) => {
		const resolved = await media.delete_file(use.context.request.result, asset.file.hash)
		if(resolved) {
			const filtered = mediaAssets.filter(a => a.file.hash !== asset.file.hash)
			setMediaAssets(filtered)
		}
	}
	
	const video_on_pointer = {
		enter(asset: MediaAsset) {
			asset.media.play()
		},
		leave(asset: MediaAsset) {
			asset.media.pause()
			asset.media.currentTime = 0
		}
	}

	return html`
		<button @click=${import_file}>IMPORT FILE</button>
		<div class="media">
			${mediaAssets.map(asset => html`
				<div
					@pointerenter=${() => video_on_pointer.enter(asset)}
					@pointerleave=${() => video_on_pointer.leave(asset)}
					class="asset"
				>
					<div class="asset-media">
						${asset.media}
						<div class="add-btn">${addSvg}</div>
						<div @click=${() => delete_file(asset)} class="delete-btn">delete</div>
					</div>
					<span class="asset-name">${asset.file.content.name}</span>
				</div>
			`)}
		</div>
	`
})

