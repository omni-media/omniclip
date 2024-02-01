import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"

export const Filmstrips = shadow_view({styles}, use => (effect: VideoEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state.timeline.zoom)
	const zoom = use.context.state.timeline.zoom
	const controller = use.context.controllers.timeline.FilmstripsManager
	const [_thumbnails, setThumbnails, getThumbnails] = use.state<string[]>([])
	const [visibleThumbnails, setVisibleThumbnails, getVisibleThumbnails] = use.state<string[]>([])
	const width_of_frame = calculate_effect_width(effect, zoom) / visibleThumbnails.length

	use.setup(() => {
		watch.track(() => use.context.state.timeline.zoom, (zoom) => {
			const visible = recalculate_visible_images(getThumbnails())
			setVisibleThumbnails(visible)
		})
		return () => {}
	})

	use.setup(() => {
		if(effect.kind === "video") {
			controller.get_frames_count(effect.file).then(async frames => {
				let generated_frames = 0
				const placeholders = generate_loading_image_placeholders(frames)
				setThumbnails(placeholders)
				const visible = recalculate_visible_images(placeholders)
				setVisibleThumbnails(visible)
				for await(const frame_blob_url of controller.generate_video_effect_filmstrips(effect.file)) {
					const updated_thumbnails = [...getThumbnails()]
					updated_thumbnails[generated_frames] = frame_blob_url
					setThumbnails(updated_thumbnails)
					const visible = recalculate_visible_images(getThumbnails())
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

	use.setup(() => {
		const intersection_observer = controller.attach_intersection_observer({root: timeline, threshold: 0}, (index) => getVisibleThumbnails()[index])
		const mutation_observer = controller.attach_mutation_observer(intersection_observer)
		mutation_observer.observe(use.shadow, {childList: true})
		return () => {mutation_observer.disconnect(), intersection_observer.disconnect()}
	})

	function generate_loading_image_placeholders(frames: number) {
		const new_arr = []
		for(let i = 0; i <= frames - 1; i++) {
			new_arr.push(new URL("/assets/loading.svg", import.meta.url).toString())
		}
		return new_arr
	}

	function recalculate_visible_images(images: string[]) {
		const max_zoom_in = 2
		const current_zoom = use.context.state.timeline.zoom
		const diff = Math.abs(current_zoom - max_zoom_in)
		const new_arr = []
		for(let i = 0; i<= images.length - 1;i+=Math.pow(2, Math.floor(diff))) {
			new_arr.push(images[i])
		}
		return new_arr
	}

	return html`${visibleThumbnails.map((thumbnail, i) => html`<img data-index=${i}  class="thumbnail" style="height: 40px; width: ${width_of_frame}px; pointer-events: none;" src=${thumbnail} />`)}`
})
