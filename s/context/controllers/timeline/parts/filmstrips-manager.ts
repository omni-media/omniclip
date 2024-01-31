import {FFprobeWorker} from "ffprobe-wasm/browser.mjs"
import {FFmpeg} from "@ffmpeg/ffmpeg/dist/esm/index.js"
import {fetchFile} from "@ffmpeg/util/dist/esm/index.js"

import {FFmpegHelper} from "../../video-export/helpers/FFmpegHelper/helper.js"

export class FilmstripsManager {
	ffprobe = new FFprobeWorker()
	ffmpeg: FFmpeg

	constructor(private ffmpeg_helper: FFmpegHelper) {
		this.ffmpeg = ffmpeg_helper.ffmpeg
	}

	async get_frames_count(file: File) {
		const probe = await this.ffprobe.getFrames(file, 1)
		return probe.nb_frames
	}

	async* generate_video_effect_filmstrips(file: File): AsyncGenerator<string> {
		let segment_number = 0

		const result = await fetchFile(file)
		await this.ffmpeg.createDir("/thumbnails")
		await this.ffmpeg.createDir("/segments")
		await this.ffmpeg.writeFile(file.name, result)
		// remux to mkv container, which supports more variety of codecs
		await this.ffmpeg.exec(["-i", file.name, "-c", "copy", "container.mkv"])
		// split into 5 second segments, so user can get new filmstrips every 5 seconds
		await this.ffmpeg.exec(["-i", "container.mkv", "-c", "copy", "-map", "0", "-reset_timestamps", "1", "-f", "segment", "-segment_time", "5", "segments/out%d.mkv"])
		const segments = await this.ffmpeg.listDir("/segments")

		for(const segment of segments) {
			if(!segment.isDir) {
				await this.ffmpeg.exec(["-i", `segments/${segment.name}`, "-filter_complex", `select='not(mod(n\,1))',scale=100:50`, "-an", "-c:v", "libwebp", `thumbnails/${segment_number}_out%d.webp`])
				const frames = await this.ffmpeg.listDir("/thumbnails")
				for(const frame of frames) {
					if(!frame.isDir) {
						const frame_data = await this.ffmpeg.readFile(`thumbnails/${frame.name}`)
						yield URL.createObjectURL(new Blob([frame_data]))
						await this.ffmpeg.deleteFile(`thumbnails/${frame.name}`)
					}
				}
			}
			segment_number += 1
		}

		await this.ffmpeg.deleteDir("/thumbnails")
		this.ffmpeg.on("log", (e) => console.log(e))
	}

	attach_intersection_observer(options: IntersectionObserverInit, update_image: (index: number) => string) {
		return new IntersectionObserver((elements) => {
		elements.forEach(element => {
			const image = element.target as HTMLImageElement
			if(element.isIntersecting) {
				const index = +image.getAttribute("data-index")!
				image.src = update_image(index)
			} else {image.src = ""}
		})
		}, options)
	}

	attach_mutation_observer(observer: IntersectionObserver) {
		return new MutationObserver((mutations) => {
			for(const mutation of mutations) {
				if(mutation.type === "childList") {
					if(mutation.nextSibling)
					mutation.addedNodes.forEach((added) => {
						const element = added as HTMLImageElement
						if(element.className === "thumbnail") {
							observer.observe(element)
						}
					})
					mutation.removedNodes.forEach(removed => {
						const element = removed as HTMLImageElement
						if(element.className === "thumbnail") {
							observer.unobserve(element)
						}
					})
				}
			}
		})
	}

}
