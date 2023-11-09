import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {Media} from "../../types.js"
import {shadow_component} from "../../context/slate.js"

export const OmniMedia = shadow_component({styles}, use => {
	const raw_media = use.state<Media[]>([{type: "Audio", source: ""}])
	return html`
		<div>
			IMPORT FILE
		</div>
	`
})

