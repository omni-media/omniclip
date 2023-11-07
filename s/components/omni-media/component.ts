import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Media} from "../../types.js"
import {omnislate} from "../../slate.js"

export const OmniMedia = omnislate.shadow_component({styles}, use => {
	const raw_media = use.state<Media[]>([{type: "Audio", source: ""}])

	return html`
		<div>
			IMPORT FILE
		</div>
	`
})

