import {GoldElement} from "@benev/slate"

import {VideoEffect, XTimeline} from "../types.js"
import {FFmpegHelper} from "../../video-export/helpers/FFmpegHelper/helper.js"
import {calculate_effect_width} from "../../../../components/omni-timeline/utils/calculate_effect_width.js"
import {calculate_start_position} from "../../../../components/omni-timeline/utils/calculate_start_position.js"

export class FilmstripManager {

	video: HTMLVideoElement
	filmstrips: string[] = []
	visible_filmstrips: {url: string, left: number}[] = []
	frames_count = 0
	resolve: null | ((value: unknown) => void) = null
	last_effect_offset_left_position = 0
	previous_scroll_position = 0

	constructor(private effect: VideoEffect, private ffmpeg: FFmpegHelper) {
		this.video = this.create_and_seek_video_effect()
	}

	async on_connect_generate_first_filmstrip(timeline_element: GoldElement, timeline: XTimeline) {
		const frames = await this.ffmpeg.get_frames_count(this.effect.file)
		this.frames_count = frames
		const placeholders = this.generate_filmstrip_placeholders(frames)
		this.filmstrips = placeholders
		for await(const {url, normalized_left, i} of this.recalculate_all_visible_filmstrips(timeline_element, timeline, timeline_element.scrollLeft,true)) {
			let new_visible = this.visible_filmstrips
			new_visible[i] = {url, left: normalized_left}
			this.visible_filmstrips = new_visible
		}
		return this.visible_filmstrips
	}

	create_and_seek_video_effect() {
		const video = document.createElement("video")
		video.src = URL.createObjectURL(this.effect.file)
		video.load()
		video.addEventListener("seeked", () => {
			const res = this.resolve
			if(res)
				res(true)
		})
		return video
	}

	is_scrolling_left(left: number) {
		let going_left = false
		if (left < this.previous_scroll_position) {
			going_left = true
		}
		this.previous_scroll_position = left
		return going_left
	}

	generate_filmstrip_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		return new_arr
	}

	get_filmstrip_at(position: number, effect: VideoEffect, zoom: number) {
		const width_of_frame_if_all_frames = calculate_effect_width(effect, zoom) / this.filmstrips.length
		let start_at_filmstrip = position / width_of_frame_if_all_frames
		return Math.floor(start_at_filmstrip)
	}

	async *recalculate_all_visible_filmstrips(timeline_element: GoldElement, timeline: XTimeline, scroll_left: number, force_recalculate?: boolean): AsyncGenerator<{
		url: string, 
		normalized_left: number, 
		i:number
	}> {
		const width_of_frame = calculate_effect_width(this.effect, 2) / this.filmstrips.length
		const margin = width_of_frame * 2
		const frame_count = timeline_element.clientWidth / 100
		const effect_left = calculate_start_position(this.effect.start_at_position, timeline.zoom)
		const normalized_left = Math.floor((timeline_element.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin < 0
			? 0
			: Math.floor((timeline_element.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin
		const scroll_move_is_bigger_than_width_of_frame = Math.abs(normalized_left - this.last_effect_offset_left_position) >= Math.floor(width_of_frame)
		const should_load_new_filmstrips = force_recalculate
			? true
			: scroll_move_is_bigger_than_width_of_frame
		if(should_load_new_filmstrips) {
			const fps = this.frames_count / this.effect.duration * 1000
			const ms = 1000/fps
			const is_left = this.is_scrolling_left(scroll_left)
			const count = is_left ? 0 : frame_count
			for(let i = 0; i<= frame_count; i+=1) {
				const effect_width = calculate_effect_width(this.effect, timeline.zoom)
				const position = normalized_left + width_of_frame * i
				if(position <= effect_width) {
					yield {url: this.filmstrips[this.get_filmstrip_at(position, this.effect, timeline.zoom)], normalized_left, i}
				}
			}
			for(let i = is_left ? frame_count : 0; is_left ? i >= count : i <= count; is_left ? i -= 1 : i += 1) {
				const effect_width = calculate_effect_width(this.effect, timeline.zoom)
				const position = normalized_left + width_of_frame * i
				if(position <= effect_width) {
					const filmstrip = this.filmstrips[this.get_filmstrip_at(position, this.effect, timeline.zoom)]
					if(filmstrip !== new URL("/assets/loading.svg", import.meta.url).toString()) {
						yield {url: filmstrip, normalized_left, i: Math.floor(i)}
					} else {
						this.video.currentTime = +(ms * this.get_filmstrip_at(Number(position.toFixed(2)), this.effect, timeline.zoom) / 1000).toFixed(2)
						await new Promise((r) => this.resolve = r)
						const canvas = document.createElement("canvas")
						canvas.width = 150
						canvas.height = 50
						const ctx = canvas.getContext("2d")
						ctx?.drawImage(this.video, 0, 0, 150, 50)
						const url = canvas.toDataURL("image/webp", 0.5)
						const filmstrips = this.filmstrips
						URL.revokeObjectURL(filmstrips[this.get_filmstrip_at(position, this.effect, timeline.zoom)])
						filmstrips[this.get_filmstrip_at(position, this.effect, timeline.zoom)] = url
						this.filmstrips = filmstrips
						yield {url, normalized_left, i: Math.floor(i)}
					}
				}
			}
		}
	}

}
