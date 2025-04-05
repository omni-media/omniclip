import {GoldElement} from "@benev/slate"

import {VideoEffect} from "../../../types.js"
import {Media} from "../../media/controller.js"
import {FFmpegHelper} from "../../video-export/helpers/FFmpegHelper/helper.js"
import {calculate_start_position} from "../../../../components/omni-timeline/utils/calculate_start_position.js"

export class Filmstrip {
	#filmstrip_frames: string[] = []
	#resolve: null | ((value: unknown) => void) = null
	#previous_scroll_position = 0
	frames_count = 0
	effect_last_offset_left_position = 0

	#video = document.createElement("video")
	#canvas = document.createElement("canvas")
	#ctx = this.#canvas.getContext("2d")

	#is_file_ready = false

	constructor(private effect: VideoEffect, private media: Media, private ffmpeg: FFmpegHelper) {
		this.#load_video_for_filmstrip()
		this.#init_filmstrip()
		this.#canvas.width = 150
		this.#canvas.height = 50
	}

	async on_file_found() {
		await this.#load_video_for_filmstrip()
		await this.#init_filmstrip()
	}

	async #load_video_for_filmstrip() {
		const file = await this.media.get_file(this.effect.file_hash)
		if(file) {
			this.#video.src = URL.createObjectURL(file)
			this.#video.load()
			this.#video.addEventListener("seeked", () => {
				const res = this.#resolve
				if(res)
					res(true)
			})
		}
	}

	dispose() {
		for(const url of this.#filmstrip_frames) {
			URL.revokeObjectURL(url)
		}
	}

	#file_ready() {
		return new Promise((resolve) => {
			if(this.#is_file_ready) {
				resolve(true)
			} else {
					const interval = setInterval(() => {
					if(this.#is_file_ready) {
						resolve(true)
						clearInterval(interval)
					}
				}, 100)
			}
		})
	}

	async #init_filmstrip() {
		const file = await this.media.get_file(this.effect.file_hash)
		if(file) {
			this.#is_file_ready = true
			this.frames_count = this.effect.frames
			const placeholders = this.#generate_filmstrip_placeholders(this.effect.frames)
			this.#filmstrip_frames = placeholders
		}
	}

	#is_scrolling_left(left: number) {
		let going_left = false
		if (left < this.#previous_scroll_position) {
			going_left = true
		}
		this.#previous_scroll_position = left
		return going_left
	}

	#get_filmstrip_frame_at(effect: VideoEffect, position: number, zoom: number) {
		const width_of_frame_if_all_frames = effect.duration * Math.pow(2, zoom) / this.#filmstrip_frames.length
		let start_at_filmstrip = (position) / width_of_frame_if_all_frames
		return Math.floor(start_at_filmstrip)
	}

	#generate_filmstrip_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(`${window.location.origin}/assets/loading.svg`)
		}
		return new_arr
	}

	get #video_fps() {
		return this.frames_count / this.effect.duration * 1000
	}

	get #video_fps_in_ms() {
		return 1000 / this.#video_fps
	}

	get effect_width() {
		return this.effect.duration * Math.pow(2, 2)
	}

	get #width_of_frame() {
		return this.effect.duration * Math.pow(2, 2) / this.#filmstrip_frames.length
	}

	*#yield_loading_placeholders(frame_count: number, normalized_left: number, effect: VideoEffect, zoom: number) {
		for(let i = 0; i<= frame_count; i+=1) {
			const position = normalized_left + this.#width_of_frame * i
			if(position <= this.effect_width) {
				yield {url: this.#filmstrip_frames[this.#get_filmstrip_frame_at(effect, position, zoom)], normalized_left, i}
			}
		}
	}

	async #draw_filmstrip_frame_and_get_its_url(effect: VideoEffect, position: number, zoom: number):Promise<string | undefined> {
		this.#video.currentTime = +(this.#video_fps_in_ms * this.#get_filmstrip_frame_at(effect, Number(position.toFixed(2)), zoom) / 1000).toFixed(2)
		await new Promise((r) => this.#resolve = r)
		this.#ctx?.drawImage(this.#video, 0, 0, 150, 50)
		const url = this.#canvas.toDataURL("image/webp", 0.5)
		URL.revokeObjectURL(this.#filmstrip_frames[this.#get_filmstrip_frame_at(effect, position, zoom)])
		if(this.#get_filmstrip_frame_at(effect, position, zoom) <= this.#filmstrip_frames.length) {
			return this.#filmstrip_frames[this.#get_filmstrip_frame_at(effect, position, zoom)] = url
		} else return undefined
	}

	async *recalculate_all_visible_filmstrip_frames(effect: VideoEffect, timeline: GoldElement, zoom: number, force_recalculate?: boolean): AsyncGenerator<{
		url: string
		normalized_left: number
		i:number
	}>{
		await this.#file_ready()
		const timeline_width = timeline.clientWidth ? timeline.clientWidth : 2000
		const frame_count = this.effect_width < timeline_width ? this.effect_width / this.#width_of_frame : timeline_width / this.#width_of_frame
		const effect_left = calculate_start_position((effect.start_at_position - effect.start), zoom)
		const normalized_left = Math.floor((timeline.scrollLeft - effect_left) / this.#width_of_frame) * this.#width_of_frame < 0
			? 0
			: Math.floor((timeline.scrollLeft - effect_left) / this.#width_of_frame) * this.#width_of_frame
		const scroll_move_is_bigger_than_width_of_frame = Math.abs(normalized_left - this.effect_last_offset_left_position) >= Math.floor(this.#width_of_frame)
		const should_load_new_filmstrip_frames = force_recalculate ?? scroll_move_is_bigger_than_width_of_frame

		if(should_load_new_filmstrip_frames) {

			for(const placeholder of this.#yield_loading_placeholders(frame_count, normalized_left, effect, zoom))
				yield placeholder

			const is_left = this.#is_scrolling_left(timeline.scrollLeft)
			const count = is_left ? 0 : frame_count

			for(let i = is_left ? frame_count : 0; is_left ? i >= count : i <= count; is_left ? i -= 1 : i += 1) {
				const position = normalized_left + this.#width_of_frame * i
				if(position <= this.effect_width) {
					const filmstrip = this.#filmstrip_frames[this.#get_filmstrip_frame_at(effect, position, zoom)]
					const filmstrip_is_already_drawn = filmstrip !== `${window.location.origin}/assets/loading.svg` && filmstrip
					if(filmstrip_is_already_drawn) {
						yield {url: filmstrip, normalized_left, i: Math.floor(i)}
					} else {
						const url = await this.#draw_filmstrip_frame_and_get_its_url(effect, position, zoom)
						if(url)
							yield {url, normalized_left, i: Math.floor(i)}
					}
				}
			}
		}
	}

}
