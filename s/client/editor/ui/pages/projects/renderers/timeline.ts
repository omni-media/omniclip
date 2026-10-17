
import {html} from "lit"

export function TimelineStrip(values: number[]) {
	return html`
		<div class="timeline-strip" aria-hidden="true">
			${values.map((value, index) => html`
				<span
					class="clip clip-${index % 4}"
					style="width: ${Math.max(6, value)}%"
				></span>
			`)}
		</div>
	`
}
