import {GoldElement, html, watch} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {calculate_effect_width} from "../../utils/calculate_effect_width.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"
import {FilmstripManager} from "../../../../context/controllers/timeline/parts/FilmstripManager.js"

export const Filmstrips = shadow_view({styles}, use => (effect: VideoEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state.timeline.zoom)
	const ffmpeg = use.context.helpers.ffmpeg
	const [visibleFilmstrips, setVisibleFilmstrips, getVisibleFilmstrips] = use.state<{url: string, left: number}[]>([])
	const filmstrip_manager = use.prepare(() => new FilmstripManager(effect, ffmpeg))
	
	use.setup(() => {
		filmstrip_manager.on_connect_generate_first_filmstrip(timeline, use.context.state.timeline).then(filmstrip => setVisibleFilmstrips(filmstrip))
		timeline.addEventListener("scroll", async (e) => {
			for await(const {url, normalized_left, i} of filmstrip_manager.recalculate_all_visible_filmstrips(timeline, use.context.state.timeline, timeline.scrollLeft)) {
				let new_visible = getVisibleFilmstrips()
				new_visible[i] = {url, left: normalized_left}
				setVisibleFilmstrips(new_visible)
			}
		})

		watch.track(() => use.context.state.timeline.zoom, async (zoom) => {
			for await(const {url, normalized_left, i} of filmstrip_manager.recalculate_all_visible_filmstrips(timeline, use.context.state.timeline, timeline.scrollLeft, true)) {
				let new_visible = getVisibleFilmstrips()
				new_visible[i] = {url, left: normalized_left}
				setVisibleFilmstrips(new_visible)
			}
		})
		return () => {
			for(const url of filmstrip_manager.filmstrips) {
				URL.revokeObjectURL(url)
			}
		}
	})

	return html`${visibleFilmstrips.map(({url, left}, i) => html`
		<img
			data-index=${i}
			class="thumbnail"
			style="
				transform: translateX(${left}px);
				height: 50px;
				width: ${calculate_effect_width(effect, 2) / filmstrip_manager.filmstrips.length}px;
				pointer-events: none;
			"
			src=${url}
		/>
	`)}`
})
