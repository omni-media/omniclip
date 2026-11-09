
import {html} from "lit"

import type WaColorPicker from "@awesome.me/webawesome/dist/components/color-picker/color-picker.js"

export function renderColorEditor(value: string, label: string, setColor: (value: string) => void) {

	const change = (event: Event) => {
		setColor((event.currentTarget as WaColorPicker).value ?? "")
	}

	return html`
		<div class="color-actions">
			<wa-color-picker size="small" format="hex" without-format-toggle
				aria-label=${label} .value=${value} @change=${change}>
			</wa-color-picker>
			<wa-button class="no-color" size="small" appearance="plain"
				?disabled=${!value} aria-label="Remove color" title="Remove color"
				@click=${() => setColor("")}>×</wa-button>
		</div>
	`
}

