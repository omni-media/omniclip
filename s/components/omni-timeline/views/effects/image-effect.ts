import {html, css, GoldElement} from "@benev/slate"

import {Effect} from "./parts/effect.js"
import {shadow_view} from "../../../../context/context.js"
import {ImageEffect as XImageEffect} from "../../../../context/types.js"

export const ImageEffect = shadow_view(use => (effect: XImageEffect, timeline: GoldElement) => {
	const media = use.context.controllers.media
	const compositor = use.context.controllers.compositor
	const [imageURL, setImageURL] = use.state<null | string>(null)

	use.once(async() => {
		const file = await media.get_file(effect.file_hash)
		if(file)
			setImageURL(URL.createObjectURL(file))
	})

	use.mount(() => {
		const dispose = media.on_media_change(async ({files, action}) => {
			for(const {hash, file} of files) {
				if(hash === effect.file_hash && action === "added") {
					await media.are_files_ready()
					compositor.managers.imageManager.add_image_effect(effect, file, true)
					if(file)
						setImageURL(URL.createObjectURL(file))
				}
			}
		})
		return () => dispose()
	})

	return html`${Effect([timeline, effect, html``, css``, `${imageURL ? `background-image: url(${imageURL});` : null}background-size: contain;`])}`
})
