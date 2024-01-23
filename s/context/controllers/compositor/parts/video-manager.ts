import {Compositor} from "../controller.js"
import {VideoEffect} from "../../timeline/types.js"

export class VideoManager extends Map<string, HTMLVideoElement> {

	constructor(private compositor: Compositor) {
		super()
	}

	add_video(effect: VideoEffect) {
		const video = document.createElement('video');
		// video.src = effect.src
		const source = document.createElement("source")
		source.type = "video/mp4"
		// video.src = `${new URL("bbb_video_avc_frag.mp4", import.meta.url)}`
		source.src = URL.createObjectURL(effect.file)
		video.append(source)
		// video.load()

		this.set(effect.id, video)
		// video.preload = 'auto';
	}

	draw_video_frame(frame: VideoFrame) {
		this.compositor.ctx!.drawImage(
			frame,
			0,
			0,
			this.compositor.canvas.width,
			this.compositor.canvas.height
		)
		frame.close()
	}

	pause_videos() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "video") {
				const video = this.get(effect.id)
				video?.pause()
			}
		}
	}

	async play_videos() {
		for(const effect of this.compositor.currently_played_effects) {
			if(effect.kind === "video") {
				const video = this.get(effect.id)
				await video?.play()
			}
		}
	}

	// play(startTime: number, endTime: number): void {
	// 	this.video.currentTime = startTime;
	// 	this.video.play();
	// }
}
