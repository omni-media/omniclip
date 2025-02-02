import {html, GoldElement, css, watch} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {VideoEffect as XVideoEffect} from "../../../../context/types.js"
import {Filmstrip} from "../../../../context/controllers/timeline/parts/filmstrip.js"

export const VideoEffect = shadow_view(use => (effect: XVideoEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state)
	const media = use.context.controllers.media
	const compositor = use.context.controllers.compositor
	const [visibleFilmstripFrames, setVisibleFilmstripFrames, getVisibleFilmstripFrames] = use.state<{url: string, left: number}[]>([])

	const {recalculate_filmstrip_frames, filmstrip} = use.once(() => {
		const filmstrip = new Filmstrip(effect, use.context.controllers.media, use.context.helpers.ffmpeg)

		const recalculate_filmstrip_frames = async (force_recalculate?: boolean) => {
			const get_effect = use.context.state.effects.find(e => e.id === effect.id) as XVideoEffect
			for await(const {url, normalized_left, i} of filmstrip.recalculate_all_visible_filmstrip_frames(get_effect, timeline, use.context.state.zoom, force_recalculate)) {
				let new_visible = getVisibleFilmstripFrames()
				new_visible[i] = {url, left: normalized_left}
				setVisibleFilmstripFrames(new_visible)
				filmstrip.effect_last_offset_left_position = normalized_left
			}
		}

		recalculate_filmstrip_frames(true)

		return {filmstrip, recalculate_filmstrip_frames}
	})

	use.mount(() => {
		const dispose = media.on_media_change(async ({files, action}) => {
			if(action === "added") {
				for(const {hash} of files) {
					const is_effect_already_composed = compositor.managers.videoManager.get(effect.id)
					if(hash === effect.file_hash && !is_effect_already_composed) {
						const filter = use.context.state.filters.find(f => f.targetEffectId === effect.id)
						await filmstrip.on_file_found()
						compositor.recreate({
							...use.context.state,
							effects: [effect],
							filters: filter
								? [filter]
								: []
						}, media)
						recalculate_filmstrip_frames(true)
					}
				}
			}
		})
		return () => dispose()
	})

	use.mount(() => {
		const recalculate = () => recalculate_filmstrip_frames()
		timeline.addEventListener("scroll", recalculate)
		const dispose = watch.track(() => use.context.state.zoom, async (zoom) => recalculate_filmstrip_frames(true))
		return () => {dispose(), timeline.removeEventListener("scroll", recalculate), filmstrip.dispose()}
	})

	const render_filmstrip = () => {
		return html`
			<div class="filmstrip">
				${visibleFilmstripFrames.map(({url, left}, i) => html`
					<img data-index=${i} class="thumbnail" style="
						position: absolute;
						transform: translateX(${left + (i * filmstrip.effect_width / filmstrip.frames_count)}px);
						height: 50px;
						width: ${filmstrip.effect_width / filmstrip.frames_count}px;
						pointer-events: none;"
						src=${url}
					/>
				`)}
			</div>`
	}

	return html`${Effect([timeline, effect, html`${render_filmstrip()}`, css`
		.content {
			pointer-events: none;
			width: 100%;
		}

		.filmstrip {
			height: 50px;
			display: flex;
			overflow: hidden;
			width: 100%;

			& img {
				display: inline;
			}

			& svg {
				display: inline;
				height: 100%;
				width: 100%;
			}
		}
	`])}`
})
