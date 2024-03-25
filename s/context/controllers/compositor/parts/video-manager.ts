import {Compositor} from "../controller.js"
import {VideoEffect} from "../../timeline/types.js"

export class VideoManager extends Map<string, {element: HTMLVideoElement, file: File}> {

	constructor(private compositor: Compositor) {
		super()
	}

	add_video(effect: VideoEffect, file: File) {
		const video = document.createElement('video');
		// video.src = effect.src
		const source = document.createElement("source")
		source.type = "video/mp4"
		// video.src = `${new URL("bbb_video_avc_frag.mp4", import.meta.url)}`
		source.src = URL.createObjectURL(file)
		video.append(source)
		// video.load()

		this.set(effect.id, {element: video, file})
		// video.preload = 'auto';
	}

	draw_video_frame(video: HTMLVideoElement) {
		this.compositor.ctx!.drawImage(
			video,
			0,
			0,
			this.compositor.canvas.width,
			this.compositor.canvas.height
		)
	}

	pause_videos() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "video") {
				const {element} = this.get(effect.id)!
				element.pause()
			}
		}
	}

	async play_videos() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "video") {
				const {element} = this.get(effect.id)!
				await element.play()
			}
		}
	}

	// play(startTime: number, endTime: number): void {
	// 	this.video.currentTime = startTime;
	// 	this.video.play();
	// }
}
