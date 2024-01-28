import {html, watch} from "@benev/slate"
import {FSNode} from "@ffmpeg/ffmpeg/dist/esm/types.js"
import {fetchFile} from "@ffmpeg/util/dist/esm/index.js"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"

export const Filmstrips = shadow_view({styles}, use => (effect: VideoEffect) => {
	use.watch(() => use.context.state.timeline.zoom)
	const zoom = use.context.state.timeline.zoom
	const ffmpeg = use.context.controllers.video_export.FFmpegHelper.ffmpeg
	const [_thumbnails, setThumbnails, getThumbnails] = use.state<string[]>([])
	const [visibleThumbnails, setVisibleThumbnails, getVisibleThumbnails] = use.state<string[]>([])
	const width_of_frame = calculate_effect_width(effect, zoom) / visibleThumbnails.length

	use.setup(() => {
		watch.track(() => use.context.state.timeline.zoom, (zoom) => recalculate_visible_images())
		return () => {}
	})
	use.setup(() => {
		if(effect.kind === "video") {
			generateVideoThumbnails(effect.file)
		}
		return () => {
			for(const url of getThumbnails()) {
				URL.revokeObjectURL(url)
			}
		}
	})
	
	function generate_loading_image_placeholders(frames: FSNode[]) {
		const new_arr = []
		for(const frame of frames) {
			if(!frame.isDir)
				new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		setThumbnails(new_arr)
	}

	function recalculate_visible_images() {
		const max_zoom_in = 2
		const current_zoom = use.context.state.timeline.zoom
		const diff = Math.abs(current_zoom - max_zoom_in)
		const is_whole_number = diff % 1 === 0
		if(is_whole_number) {
			setVisibleThumbnails([])
			for(let i = 0; i<= getThumbnails().length;i+=Math.pow(2, diff)) {
				setVisibleThumbnails([...getVisibleThumbnails(), getThumbnails()[i]])
			}
		}
	}

	async function generateVideoThumbnails(file: File) {
		let generated_frames = 0
		const result = await fetchFile(file)
		await ffmpeg.createDir("/thumbnails")
		await ffmpeg.writeFile(file.name, result)
		await ffmpeg.exec(["-i", file.name,"-filter_complex",`select='not(mod(n\,1))',scale=100:50`,"-an","-c:v", "libwebp", "thumbnails/out%d.webp"])
		const frames = await ffmpeg.listDir("/thumbnails")
		generate_loading_image_placeholders(frames)

		for(const frame of frames) {
			if(!frame.isDir) {
				const frame_data = await ffmpeg.readFile(`thumbnails/${frame.name}`)
				const new_arr = getThumbnails()
				new_arr[generated_frames] = URL.createObjectURL(new Blob([frame_data]))
				setThumbnails(new_arr)
				generated_frames += 1
				recalculate_visible_images()
				await ffmpeg.deleteFile(`thumbnails/${frame.name}`)
			}
		}

		await ffmpeg.deleteDir("/thumbnails")
		ffmpeg.on("log", (e) => console.log(e, "LOGGG"))
	}

	return html`${visibleThumbnails.map((thumbnail) => html`<img style="height: 40px; width: ${width_of_frame}px; pointer-events: none;" src=${thumbnail} />`)}`
})
