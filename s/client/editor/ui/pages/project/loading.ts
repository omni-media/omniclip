
import {html} from "lit"

import "@awesome.me/webawesome/dist/components/skeleton/skeleton.js"

const skeleton = (className: string) => html`
	<wa-skeleton class=${className} effect="sheen"></wa-skeleton>
`

const rows = (count: number) => html`
	<div class="loading-rows">
		${Array.from({length: count}, () => skeleton("loading-row"))}
	</div>
`

const fields = (count: number) => html`
	<div class="loading-fields">
		${Array.from({length: count}, () => html`
			<div class="loading-field">
				${skeleton("loading-field-label")}
				${skeleton("loading-field-value")}
			</div>
		`)}
	</div>
`

export const ProjectLoading = () => html`
	<div class="loading-panels">
		<section class="loading-panel loading-browser">
			${skeleton("loading-title")}
			<div class="loading-toolbar">
				${skeleton("loading-search")}
				${skeleton("loading-control")}
				${skeleton("loading-control")}
			</div>
			<div class="loading-media-grid">
				${Array.from({length: 4}, () => html`
					<div class="loading-media-card">
						${skeleton("loading-thumbnail")}
						${skeleton("loading-label")}
					</div>
				`)}
			</div>
		</section>

		<section class="loading-panel loading-outliner">
			${skeleton("loading-title")}
			${rows(7)}
		</section>

		<section class="loading-panel loading-viewport">
			${skeleton("loading-viewer")}
		</section>

		<section class="loading-panel loading-timeline">
			${skeleton("loading-ruler")}
			<div class="loading-tracks">
				${Array.from({length: 4}, () => skeleton("loading-track"))}
			</div>
		</section>

		<section class="loading-panel loading-inspector">
			${skeleton("loading-title")}
			${fields(6)}
		</section>

		<section class="loading-panel loading-audio">
			${skeleton("loading-title")}
			<div class="loading-meters">
				${Array.from({length: 3}, () => skeleton("loading-meter"))}
			</div>
		</section>
	</div>
`

