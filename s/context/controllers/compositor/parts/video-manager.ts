import {generate_id} from "@benev/slate"
import {FabricImage} from "fabric/dist/index.mjs"

import {Compositor} from "../controller.js"
import {Actions} from "../../../actions.js"
import {VideoEffect, State} from "../../../types.js"
import {Video} from "../../../../components/omni-media/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class VideoManager extends Map<string, FabricImage> {
	#effect_canvas = new Map<string, HTMLCanvasElement>()
	#videoElements = new Map<string, HTMLVideoElement>()

	constructor(private compositor: Compositor, private actions: Actions) {
		super()
	}

	create_and_add_video_effect(video: Video, state: State) {
		const adjusted_duration_to_timebase = Math.floor(video.duration / (1000/state.timebase)) * (1000/state.timebase) - 200
		const effect: VideoEffect = {
			frames: video.frames,
			id: generate_id(),
			name: video.file.name,
			kind: "video",
			file_hash: video.hash,
			raw_duration: video.duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 0,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 0,
			thumbnail: video.thumbnail,
                        volume: video.element.volume,
			rect: {
				position_on_canvas: {x: 0, y: 0},
				width: video.element.videoWidth,
				height: video.element.videoHeight,
				rotation: 0,
				scaleX: 1,
				scaleY: 1
			}
		}
		const {position, track} = find_place_for_new_effect(state.effects, state.tracks)
		effect.start_at_position = position!
		effect.track = track
		this.add_video_effect(effect, video.file)
	}

	add_video_effect(effect: VideoEffect, file: File, recreate?: boolean) {
		const element = document.createElement('video')
		const obj = URL.createObjectURL(file)
		element.src = obj
		element.load()
		element.width = effect.rect.width
		element.height = effect.rect.height
                element.volume = effect.volume
		this.#videoElements.set(effect.id, element)
		const video = new FabricImage(element, {
			top: effect.rect.position_on_canvas.y,
			left: effect.rect.position_on_canvas.x,
			scaleX: effect.rect.scaleX,
			scaleY: effect.rect.scaleY,
			objectCaching: false,
			effect: {...effect}
		})
		this.set(effect.id, video)
		const canvas = document.createElement("canvas")
		canvas.getContext("2d")!.imageSmoothingEnabled = false
		this.#effect_canvas.set(effect.id, canvas)
		if(recreate) {return}
		this.actions.add_video_effect(effect)
	}

	add_video_to_canvas(effect: VideoEffect) {
		const max_track = 4 // lower track means it should draw on top of higher tracks, although moveObjectTo z-index works in reverse
		const video = this.get(effect.id)
		if(video) {
			this.compositor.canvas.add(video)
			this.compositor.canvas.moveObjectTo(video, max_track - effect.track)
			this.compositor.canvas.renderAll()
		}
	}

	remove_video_from_canvas(effect: VideoEffect) {
		const video = this.get(effect.id)
		if(video) {
			this.compositor.canvas.remove(video)
			this.compositor.canvas.renderAll()
		}
	}

	//reset element to state before export started
	reset(effect: VideoEffect) {
		const video = this.get(effect.id)
		if(video) {
			const element = this.#videoElements.get(effect.id)!
			video.setElement(element)
		}
	}

	draw_decoded_frame(effect: VideoEffect, frame: VideoFrame) {
		const video = this.get(effect.id)
		if(video) {
			const canvas = this.#effect_canvas.get(effect.id)!
			canvas.width = video.width
			canvas.height = video.height
			canvas.getContext("2d")!.drawImage(frame, 0,0, video.width, video.height)
			video.setElement(canvas)
		}
	}

	pause_videos() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "video") {
				const video = this.get(effect.id)
				if(video) {
					const element = video._originalElement as HTMLVideoElement
					element.pause()
				}
			}
		}
	}

	async play_videos() {
		for(const effect of this.compositor.currently_played_effects.values()) {
			if(effect.kind === "video") {
				const video = this.get(effect.id)
				if(video) {
					const element = video._originalElement as HTMLVideoElement
					await	element.play()
				}
			}
		}
	}

	pause_video(effect: VideoEffect) {
		const video = this.get(effect.id)
		if(video) {
			const element = video._originalElement as HTMLVideoElement
			element.pause()
		}
	}

	async play_video(effect: VideoEffect) {
		const video = this.get(effect.id)
		if(video) {
			const element = video._originalElement as HTMLVideoElement
			await element.play()
		}
	}
        
        set_volume(effect: VideoEffect, volume: number){
            let e = this.get(effect.id)
            let element = this.#videoElements.get(effect.id) as HTMLMediaElement
            element.volume = volume
            this.actions.set_effect_volume(effect, volume)
        }
}
