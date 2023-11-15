import {html} from "@benev/slate"

import {Media} from "./types.js"
import {styles} from "./styles.js"
import {shadow_component} from "../../context/slate.js"

export const OmniMedia = shadow_component({styles}, use => {
	const raw_media = use.state<Media[]>([{type: "Audio", source: ""}])
	return html`
		<div>
			IMPORT FILE
		</div>
	`
})

