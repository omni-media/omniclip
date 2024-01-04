import {VideoEffect} from "../../timeline/types.js"

export class VideoManager extends Map<string, HTMLVideoElement> {

	add_video(effect: VideoEffect) {
		const video = document.createElement('video');
		// video.src = effect.src
		const source = document.createElement("source")
		source.type = "video/mp4"
		// video.src = `${new URL("bbb_video_avc_frag.mp4", import.meta.url)}`
		source.src = `${new URL("./bbb_video_avc_frag.mp4", import.meta.url)}`
		video.append(source)
		// video.load()

		this.set(effect.id, video)
		// video.preload = 'auto';
	}

	// play(startTime: number, endTime: number): void {
	// 	this.video.currentTime = startTime;
	// 	this.video.play();
	// }
}
