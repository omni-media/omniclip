import {html, css, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {ImageEffect as XImageEffect} from "../../../../context/types.js"

export const ImageEffect = shadow_view(use => (effect: XImageEffect, timeline: GoldElement) => {
	use.watch(() => use.context.state)
	const media = use.context.controllers.media
	const compositor = use.context.controllers.compositor
	const [imageURL, setImageURL] = use.state<null | string>(null)

	use.once(async() => {
		const file = await media.get_file(effect.file_hash)
		if(file)
			setImageURL(URL.createObjectURL(file))
	})

	use.mount(() => {
		const dispose = media.on_media_change(({files, action}) => {
			if(action === "added") {
				for(const {hash, file} of files) {
					const is_effect_already_composed = compositor.managers.imageManager.get(effect.id)
					if(hash === effect.file_hash && !is_effect_already_composed) {
						compositor.recreate({...use.context.state, effects: [effect]}, media)
						setImageURL(URL.createObjectURL(file))
					}
				}
			}
		})
		return () => dispose()
	})

	return html`${Effect([timeline, effect, html``, css``, `${imageURL ? `background-image: url(${imageURL});` : null}background-size: contain;`])}`
})
