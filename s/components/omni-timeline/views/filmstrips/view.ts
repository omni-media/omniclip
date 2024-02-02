import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"

export const Filmstrips = shadow_view({styles}, use => (effect: VideoEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state.timeline.zoom)
	const ffmpeg = use.context.helpers.ffmpeg
	const [_thumbnails, setThumbnails, getThumbnails] = use.state<string[]>([])
	const [visibleThumbnails, setVisibleThumbnails, getVisibleThumbnails] = use.state<string[]>([])
	const [startAt, setStartAt] = use.state(0)
	const [_, setLastEffectOffsetLeftPosition, getLastEffectOffseLeftPosition] = use.state(0)

	use.setup(() => {
		timeline.addEventListener("scroll", () => {
			const width_of_frame = calculate_effect_width(effect, 2) / getThumbnails().length
			const margin = width_of_frame * 2
			const effect_left = calculate_start_position(effect.start_at_position, use.context.state.timeline.zoom)
			const normalized_left = Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin < 0
			? 0
			: Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin
			const frame_count = timeline.clientWidth / width_of_frame
			const difference = Math.abs(normalized_left - getLastEffectOffseLeftPosition())
			if(difference >= Math.floor(width_of_frame)) {
				const new_arr = []
				setLastEffectOffsetLeftPosition(normalized_left)
				for(let i = 0; i<= frame_count;i+=1) {
					const effect_width = calculate_effect_width(effect, use.context.state.timeline.zoom)
					const position = normalized_left + width_of_frame * i
					if(position <= effect_width)
						new_arr.push(getThumbnails()[get_filmstrip_at(position)])
				}
				setStartAt(normalized_left)
				setVisibleThumbnails(new_arr)
			}
		})

		watch.track(() => use.context.state.timeline.zoom, (zoom) => {
			const visible = recalculate_all_visible_images(getThumbnails())
			setVisibleThumbnails(visible)
		})
		return () => {}
	})

	use.setup(() => {
		if(effect.kind === "video") {
			ffmpeg.get_frames_count(effect.file).then(async frames => {
				let generated_frames = 0
				const placeholders = generate_loading_image_placeholders(frames)
				setThumbnails(placeholders)
				const visible = recalculate_all_visible_images(placeholders)
				setVisibleThumbnails(visible)
				for await(const frame_blob_url of ffmpeg.generate_video_effect_filmstrips(effect.file)) {
					const updated_thumbnails = [...getThumbnails()]
					updated_thumbnails[generated_frames] = frame_blob_url
					setThumbnails(updated_thumbnails)
					const visible = recalculate_all_visible_images(getThumbnails())
					setVisibleThumbnails(visible)
					generated_frames += 1
				}
			})
		}
		return () => {
			for(const url of getThumbnails()) {
				URL.revokeObjectURL(url)
			}
		}
	})

	function get_filmstrip_at(position: number) {
		const width_of_frame_if_all_frames = calculate_effect_width(effect, use.context.state.timeline.zoom) / getThumbnails().length
		let start_at_filmstrip = position / width_of_frame_if_all_frames
		return Math.floor(start_at_filmstrip)
	}

	function generate_loading_image_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		return new_arr
	}

	function recalculate_all_visible_images(images: string[]) {
		const new_arr = []
		const width_of_frame = calculate_effect_width(effect, 2) / getThumbnails().length
		const margin = width_of_frame * 2
		const frame_count = timeline.clientWidth / 100
		const effect_left = calculate_start_position(effect.start_at_position, use.context.state.timeline.zoom)
		const normalized_left = Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin < 0
		? 0
		: Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin
		for(let i = 0; i<= frame_count;i+=1) {
			const effect_width = calculate_effect_width(effect, use.context.state.timeline.zoom)
			const position = normalized_left + width_of_frame * i
			if(position <= effect_width)
				new_arr.push(getThumbnails()[get_filmstrip_at(position)])
		}
		setStartAt(normalized_left)
		return new_arr
	}

	return html`${visibleThumbnails.map((thumbnail, i) => html`<img data-index=${i}  class="thumbnail" style="transform: translateX(${startAt}px);height: 40px; width: ${calculate_effect_width(effect, 2) / getThumbnails().length}px; pointer-events: none;" src=${thumbnail} />`)}`
})
