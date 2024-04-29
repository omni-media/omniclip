import {generate_id} from "@benev/slate"
import {FabricImage} from "fabric/dist/index.mjs"

import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {VideoEffect, XTimeline} from "../../timeline/types.js"
import {Video} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class VideoManager extends Map<string, {fabric: FabricImage, file: File}> {
	#canvas = document.createElement("canvas")

	constructor(private compositor: Compositor, private actions: TimelineActions) {super()}

	create_and_add_video_effect(video: Video, timeline: XTimeline) {
		const duration = video.element.duration * 1000
		const adjusted_duration_to_timebase = Math.floor(duration / (1000/timeline.timebase)) * (1000/timeline.timebase) - 40
		const effect: VideoEffect = {
			frames: video.frames,
			id: generate_id(),
			kind: "video",
			raw_duration: duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 0,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 0,
			thumbnail: video.thumbnail,
			rect: {
				position_on_canvas: {x: 0, y: 0},
				width: 1280,
				height: 720,
				rotation: 0,
			}
		}
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		this.add_video_effect(effect, video.file, video.element.videoWidth, video.element.videoHeight)
	}

	add_video_effect(effect: VideoEffect, file: File, width: number, height: number) {
		const element = document.createElement('video')
		const obj = URL.createObjectURL(file)
		element.src = obj
		element.load()
		element.width = width
		element.height = height
		const video = new FabricImage(element, {
			left: 0,
			top: 0,
			width,
			height,
			objectCaching: false,
			effect: {...effect}
		})
		video.scaleToWidth(effect.rect.width)
		video.scaleToHeight(effect.rect.height)
		this.set(effect.id, {fabric: video, file})
		this.actions.add_video_effect(effect)
	}

	add_video_to_canvas(effect: VideoEffect) {
		const max_track = 4 // lower track means it should draw on top of higher tracks, although moveObjectTo z-index works in reverse
		const video = this.get(effect.id)!.fabric
		this.compositor.canvas.add(video)
		this.compositor.canvas.moveObjectTo(video, max_track - effect.track)
		this.compositor.canvas.renderAll()
	}

	remove_video_from_canvas(effect: VideoEffect) {
		const video = this.get(effect.id)!.fabric
		this.compositor.canvas.remove(video)
		this.compositor.canvas.renderAll()
	}

	draw_decoded_frame(effect: VideoEffect, frame: VideoFrame) {
		const video = this.get(effect.id)!.fabric
		this.#canvas.width = video.width
		this.#canvas.height = video.height
		this.#canvas.getContext("2d")!.drawImage(frame, 0,0, video.width, video.height)
		video.setElement(this.#canvas)
	}

	pause_videos() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "video") {
				const {fabric} = this.get(effect.id)!
				const element = fabric.getElement() as HTMLVideoElement
				element.pause()
			}
		}
	}

	async play_videos() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "video") {
				const {fabric} = this.get(effect.id)!
				const element = fabric.getElement() as HTMLVideoElement
				await	element.play()
			}
		}
	}

}
