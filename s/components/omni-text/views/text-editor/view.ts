import {html} from "@benev/slate"

import {Text} from "../../types.js"
import {styles} from "../../styles.js"
import {shadow_view} from "../../../../context/slate.js"

export const TextEditor = shadow_view({styles}, use => (
	text: Text,
	update_active_text: (text: Text) => void
) => {

	let on_property_change = <Key extends keyof Text>(e: Event, attribute: Key) => {
		let target = e.currentTarget as HTMLFormElement
		let old_value = text[attribute]
		let new_text : Text = {...text}
		new_text[attribute] = target.value as typeof old_value
		update_active_text(new_text)
	}

	return html`
		<div class="text-editor">
			Color:
			<input
				@input="${(e:Event)=>on_property_change(e,'color')}"
				type="color"
				.value=${text.color}
			>
			Size
			<input
				@input="${(e:Event)=>on_property_change(e,'size')}"
				type="number"
				.value=${text.size}
			>
			X-pos
			<input
				@input="${(e: Event) => on_property_change(e, "position_x")}"
				type="number"
				.value=${text.position_x}
			>
			Y-pos
			<input
				@input="${(e: Event) => on_property_change(e, "position_y")}" 
				type="number"
				.value=${text.position_y}
			>
		</div>
	`
})


