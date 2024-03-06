import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"
import {calculate_start_position} from "../../utils/calculate_start_position.js"

export const Filmstrips = shadow_view(use => (effect: VideoEffect, timeline: GoldElement) => {
	use.styles(styles)
	use.watch(() => use.context.state.timeline)
	const ffmpeg = use.context.helpers.ffmpeg
	const [_thumbnails, setFilmstrips, getFilmstrips] = use.state<string[]>([])
	const [visibleFilmstrips, setVisibleFilmstrips, getVisibleFilmstrips] = use.state<{url: string, left: number}[]>([])
	const [_, setLastEffectOffsetLeftPosition, getLastEffectOffseLeftPosition] = use.state(0)
	const [resolve, setResolve, getResolve] = use.state<null | ((value: unknown) => void)>(null)
	const [prev, setPreviousScrollPosition, getPreviousScrollPosition] = use.state(0)
	const [_f, setFramesCount, getFramesCount] = use.state(0)

	use.mount(() => {
		timeline.addEventListener("scroll", async (e) => {
			const get_effect = use.context.state.timeline.effects.find(e => e.id === effect.id)! as VideoEffect
			for await(const {url, normalized_left, i} of recalculate_all_visible_filmstrips(get_effect, timeline.scrollLeft)) {
				let new_visible = getVisibleFilmstrips()
				new_visible[i] = {url, left: normalized_left}
				setVisibleFilmstrips(new_visible)
				setLastEffectOffsetLeftPosition(normalized_left)
			}
		})

		watch.track(() => use.context.state.timeline.zoom, async (zoom) => {
			const get_effect = use.context.state.timeline.effects.find(e => e.id === effect.id)! as VideoEffect
			for await(const {url, normalized_left, i} of recalculate_all_visible_filmstrips(get_effect, timeline.scrollLeft, true)) {
				let new_visible = getVisibleFilmstrips()
				new_visible[i] = {url, left: normalized_left}
				setVisibleFilmstrips(new_visible)
			}
		})
		return () => {}
	})

	const worker = use.once(() => new Worker(new URL("./filmstrip_worker.js", import.meta.url), {type: "module"}))
	const video = use.once(() => {
		const video = document.createElement("video")
		video.src = URL.createObjectURL(effect.file)
		video.load()
		video.addEventListener("seeked", () => {
			const res = getResolve()
			if(res)
				res(true)
		})
		return video
	})

	function is_scrolling_left(left: number) {
		let going_left = false
		if (left < getPreviousScrollPosition()) {
			going_left = true
		}
		setPreviousScrollPosition(left)
		return going_left
	}

	use.mount(() => {
		if(effect.kind === "video") {
			ffmpeg.get_frames_count(effect.file).then(async frames => {
				setFramesCount(frames)
				const placeholders = generate_filmstrip_placeholders(frames)
				setFilmstrips(placeholders)
				for await(const {url, normalized_left, i} of recalculate_all_visible_filmstrips(effect, timeline.scrollLeft, true)) {
					let new_visible = getVisibleFilmstrips()
					new_visible[i] = {url, left: normalized_left}
					setVisibleFilmstrips(new_visible)
				}
			})
		}
		return () => {
			for(const url of getFilmstrips()) {
				URL.revokeObjectURL(url)
			}
		}
	})

	function get_filmstrip_at(effect: VideoEffect, position: number) {
		const width_of_frame_if_all_frames = effect.duration * Math.pow(2, use.context.state.timeline.zoom) / getFilmstrips().length
		let start_at_filmstrip = (position) / width_of_frame_if_all_frames
		return Math.floor(start_at_filmstrip)
	}

	function generate_filmstrip_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		return new_arr
	}

	async function *recalculate_all_visible_filmstrips(effect: VideoEffect, scroll_left: number, force_recalculate?: boolean): AsyncGenerator<{
		url: string
		normalized_left: number
		i:number
	}> {
		const width_of_frame = effect.duration * Math.pow(2, 2) / getFilmstrips().length
		const margin = width_of_frame * 2
		const effect_width = effect.duration * Math.pow(2, 2)
		const frame_count = effect_width < timeline.clientWidth 
			? effect_width / 100
			: timeline.clientWidth / 100
		const effect_left = calculate_start_position((effect.start_at_position - effect.start), use.context.state.timeline.zoom)
		const normalized_left = Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin < 0
			? 0
			: Math.floor((timeline.scrollLeft - effect_left) / width_of_frame) * width_of_frame - margin
		const scroll_move_is_bigger_than_width_of_frame = Math.abs(normalized_left - getLastEffectOffseLeftPosition()) >= Math.floor(width_of_frame)
		const should_load_new_filmstrips = force_recalculate
			? true
			: scroll_move_is_bigger_than_width_of_frame
		if(should_load_new_filmstrips) {
			const fps = getFramesCount() / effect.duration * 1000
			const ms = 1000/fps
			const is_left = is_scrolling_left(scroll_left)
			const count = is_left ? 0 : frame_count
			for(let i = 0; i<= frame_count; i+=1) {
				const effect_width = effect.duration * Math.pow(2, 2)
				const position = normalized_left + width_of_frame * i
				if(position <= effect_width) {
					yield {url: getFilmstrips()[get_filmstrip_at(effect, position)], normalized_left, i}
				}
			}
			for(let i = is_left ? frame_count : 0; is_left ? i >= count : i <= count; is_left ? i -= 1 : i += 1) {
				const effect_width = effect.duration * Math.pow(2, 2)
				const position = normalized_left + width_of_frame * i
				if(position <= effect_width) {
					const filmstrip = getFilmstrips()[get_filmstrip_at(effect, position)]
					if(filmstrip !== new URL("/assets/loading.svg", import.meta.url).toString()) {
						yield {url: filmstrip, normalized_left, i: Math.floor(i)}
					} else {
						video.currentTime = +(ms * get_filmstrip_at(effect, Number(position.toFixed(2))) / 1000).toFixed(2)
						await new Promise((r) => setResolve(r))
						const canvas = document.createElement("canvas")
						canvas.width = 150
						canvas.height = 50
						const ctx = canvas.getContext("2d")
						ctx?.drawImage(video, 0, 0, 150, 50)
						const url = canvas.toDataURL("image/webp", 0.5)
						const filmstrips = getFilmstrips()
						URL.revokeObjectURL(filmstrips[get_filmstrip_at(effect, position)])
						filmstrips[get_filmstrip_at(effect, position)] = url
						setFilmstrips(filmstrips)
						yield {url, normalized_left, i: Math.floor(i)}
					}
				}
			}
		}
	}

	return html`${visibleFilmstrips.map(({url, left}, i) => html`<img data-index=${i}  class="thumbnail" style="position: absolute; transform: translateX(${left + (i * (effect.duration * Math.pow(2,2))/ getFilmstrips().length - (effect.start * Math.pow(2, use.context.state.timeline.zoom))) }px);height: 50px; width: ${effect.duration * Math.pow(2, 2) / getFilmstrips().length}px; pointer-events: none;" src=${url} />`)}`
})
