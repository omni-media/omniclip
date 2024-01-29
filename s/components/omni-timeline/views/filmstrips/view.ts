import {GoldElement, html, watch} from "@benev/slate"
import {FFprobeWorker} from "ffprobe-wasm/browser.mjs"
import {fetchFile} from "@ffmpeg/util/dist/esm/index.js"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"

export const Filmstrips = shadow_view({styles}, use => (effect: VideoEffect, timeline: GoldElement) => {
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
			generate_video_thumbnails(effect.file)
		}
		return () => {
			for(const url of getThumbnails()) {
				URL.revokeObjectURL(url)
			}
		}
	})

	use.setup(() => {
		const options = {
			root: timeline,
			threshold: 0
		}
		const observer = new IntersectionObserver((elements) => {
		elements.forEach(element => {
			const image = element.target as HTMLImageElement
			if(element.isIntersecting) {
				const index = +image.getAttribute("data-index")!
				image.src = getVisibleThumbnails()[index]
			} else {image.src = ""}
		})
		}, options)
		const mutation_observer = new MutationObserver((mutations) => {
			for(const mutation of mutations) {
				if(mutation.type === "childList") {
					mutation.addedNodes.forEach((added) => {
						const element = added as HTMLElement
						if(element.className === "thumbnail") {
							observer.observe(element)
						}
					})
					mutation.removedNodes.forEach(removed => {
						const element = removed as HTMLElement
						if(element.className === "thumbnail") {
							observer.unobserve(element)
						}
					})
				}
			}
		})
		mutation_observer.observe(use.shadow, {childList: true})
		return () => {mutation_observer.disconnect(), observer.disconnect()}
	})

	const ffprobe = use.prepare(() => new FFprobeWorker())

	function generate_loading_image_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		setThumbnails(new_arr)
	}

	function recalculate_visible_images() {
		const max_zoom_in = 2
		const current_zoom = use.context.state.timeline.zoom
		const diff = Math.abs(current_zoom - max_zoom_in)
		setVisibleThumbnails([])
		for(let i = 0; i<= getThumbnails().length - 1;i+=Math.pow(2, Math.floor(diff))) {
			setVisibleThumbnails([...getVisibleThumbnails(), getThumbnails()[i]])
		}
	}

	async function generate_video_thumbnails(file: File) {
		let generated_frames = 0
		let segment_number = 0

		const result = await fetchFile(file)
		await ffmpeg.createDir("/thumbnails")
		await ffmpeg.createDir("/segments")
		await ffmpeg.writeFile(file.name, result)
		const probe = await ffprobe.getFrames(file, 1)
		generate_loading_image_placeholders(probe.nb_frames)
		// remux to mkv container, which supports more variety of codecs
		await ffmpeg.exec(["-i", file.name, "-c", "copy", "container.mkv"])
		// split into 5 second segments, so user can get new filmstrips every 5 seconds
		await ffmpeg.exec(["-i", "container.mkv", "-c", "copy", "-map", "0", "-reset_timestamps", "1", "-f", "segment", "-segment_time", "5", "segments/out%d.mkv"])
		const segments = await ffmpeg.listDir("/segments")

		for(const segment of segments) {
			if(!segment.isDir) {
				await ffmpeg.exec(["-i", `segments/${segment.name}`, "-filter_complex", `select='not(mod(n\,1))',scale=100:50`, "-an", "-c:v", "libwebp", `thumbnails/${segment_number}_out%d.webp`])
				const frames = await ffmpeg.listDir("/thumbnails")
				for(const frame of frames) {
					if(!frame.isDir) {
						const frame_data = await ffmpeg.readFile(`thumbnails/${frame.name}`)
						const new_arr = [...getThumbnails()]
						new_arr[generated_frames] = URL.createObjectURL(new Blob([frame_data]))
						setThumbnails(new_arr)
						generated_frames += 1
						recalculate_visible_images()
						await ffmpeg.deleteFile(`thumbnails/${frame.name}`)
					}
				}
			}
			segment_number += 1
		}

		await ffmpeg.deleteDir("/thumbnails")
		ffmpeg.on("log", (e) => console.log(e))
	}

	return html`${visibleThumbnails.map((thumbnail, i) => html`<img data-index=${i}  class="thumbnail" style="height: 40px; width: ${width_of_frame}px; pointer-events: none;" src=${thumbnail} />`)}`
})
