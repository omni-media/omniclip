import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {XClip} from "../../../../context/controllers/timeline/types.js"

export const Clip = shadow_view({styles}, use => (clip: XClip, id: number) => {

	use.setup(() => {
		const {id} = clip
		return () => console.log("DISPOSE", id)
	})

	return html`
		<span
			data-id="${id}"
			class="clip"
			style="
				width: 7500px;
				transform: translate(0px, ${clip.track * 40}px);
			"
			draggable="true"
			@click=${() => {
				const {id} = clip
				console.log("remove", id)
				use.context.actions.timeline_actions.remove_effect(clip)
			}}
		>
			${clip.item.type}
		</span>
	`
})
