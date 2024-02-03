import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"

export const Filmstrips = shadow_view({styles}, use => (effect: VideoEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state.timeline.zoom)
	const ffmpeg = use.context.helpers.ffmpeg
	const [_thumbnails, setFilmstrips, getFilmstrips] = use.state<string[]>([])
	const [visibleFilmstrips, setVisibleFilmstrips] = use.state<string[]>([])
	const [startAt, setStartAt] = use.state(0)
	const [_, setLastEffectOffsetLeftPosition, getLastEffectOffseLeftPosition] = use.state(0)

	use.setup(() => {
		timeline.addEventListener("scroll", () => {
			const result = recalculate_all_visible_filmstrips()
			if(result) {
				setVisibleFilmstrips(result.visible)
				setStartAt(result.normalized_left)
				setLastEffectOffsetLeftPosition(result.normalized_left)
			}
		})

		watch.track(() => use.context.state.timeline.zoom, (zoom) => {
			const result = recalculate_all_visible_filmstrips(true)
			if(result) {
				setStartAt(result.normalized_left)
				setVisibleFilmstrips(result.visible)
			}
		})
		return () => {}
	})

	use.setup(() => {
		if(effect.kind === "video") {
			ffmpeg.get_frames_count(effect.file).then(async frames => {
				let generated_frames = 0
				const placeholders = generate_loading_filmstrip_placeholders(frames)
				setFilmstrips(placeholders)
				const result = recalculate_all_visible_filmstrips(true)
				if(result) {
					setVisibleFilmstrips(result.visible)
					setStartAt(result.normalized_left)
				}
				for await(const frame_blob_url of ffmpeg.generate_video_effect_filmstrips(effect.file)) {
					const updated_thumbnails = [...getFilmstrips()]
					updated_thumbnails[generated_frames] = frame_blob_url
					setFilmstrips(updated_thumbnails)
					const result = recalculate_all_visible_filmstrips(true)
					if(result) {
						setStartAt(result.normalized_left)
						setVisibleFilmstrips(result.visible)
					}
					generated_frames += 1
				}
			})
		}
		return () => {
			for(const url of getFilmstrips()) {
				URL.revokeObjectURL(url)
			}
		}
	})

	function get_filmstrip_at(position: number) {
		const width_of_frame_if_all_frames = calculate_effect_width(effect, use.context.state.timeline.zoom) / getFilmstrips().length
		let start_at_filmstrip = position / width_of_frame_if_all_frames
		return Math.floor(start_at_filmstrip)
	}

	function generate_loading_filmstrip_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		return new_arr
	}

	function recalculate_all_visible_filmstrips(force_recalculate?: boolean) {
		const new_arr = []
		const width_of_frame = calculate_effect_width(effect, 2) / getFilmstrips().length
		const margin = width_of_frame * 2
		const frame_count = timeline.clientWidth / 100
		const effect_left = calculate_start_position(effect.start_at_position, use.context.state.timeline.zoom)
		const normalized_left = Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin < 0
			? 0
			: Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin
		const scroll_move_is_bigger_than_width_of_frame = Math.abs(normalized_left - getLastEffectOffseLeftPosition()) >= Math.floor(width_of_frame)
		const should_load_new_filmstrips = force_recalculate
			? true
			: scroll_move_is_bigger_than_width_of_frame
		if(should_load_new_filmstrips) {
			for(let i = 0; i<= frame_count; i+=1) {
				const effect_width = calculate_effect_width(effect, use.context.state.timeline.zoom)
				const position = normalized_left + width_of_frame * i
				if(position <= effect_width)
					new_arr.push(getFilmstrips()[get_filmstrip_at(position)])
			}
			return {visible: new_arr, normalized_left}
		}
	}

	return html`${visibleFilmstrips.map((filmstrip, i) => html`<img data-index=${i}  class="thumbnail" style="transform: translateX(${startAt}px);height: 40px; width: ${calculate_effect_width(effect, 2) / getFilmstrips().length}px; pointer-events: none;" src=${filmstrip} />`)}`
})
