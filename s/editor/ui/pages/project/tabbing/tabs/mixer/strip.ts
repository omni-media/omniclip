
import {html} from "lit"
import {Id} from "@omnimedia/omnitool"

import {dbFromGain, maximumGainDb, minimumGainDb, sliderDbFromGain} from "./utils.js"

export type MixerStrip = {
	id: Id | null
	name: string
	color: string
	gain: number
	level: number
	count: number
	disabled: boolean
}

export function renderMixerStrip({
	strip,
	onToggle,
	onCommitGain
}: {
	strip: MixerStrip
	onToggle: (strip: MixerStrip) => void
	onCommitGain: (strip: MixerStrip, event: Event) => void
}) {
	const gainDb = sliderDbFromGain(strip.gain)

	return html`
		<section
			class="strip"
			style="--role-color: ${strip.color}"
			?data-disabled=${strip.disabled}
		>
			<div class="strip-top">
				<strong>${strip.name}</strong>
				<span>${dbFromGain(strip.gain)} dB</span>
			</div>

			${strip.id === null ? html`<div class="strip-buttons"></div>` : html`
				<div class="strip-buttons">
					<wa-button
						size="small"
						variant="neutral"
						?data-active=${!strip.disabled}
						@click=${() => onToggle(strip)}
					>
						ON
					</wa-button>
					<wa-button
						size="small"
						variant="neutral"
						?data-active=${strip.disabled}
						@click=${() => onToggle(strip)}
					>
						MUTE
					</wa-button>
				</div>
			`}

			<div class="fader-row">
				<wa-slider
					orientation="vertical"
					min=${minimumGainDb}
					max=${maximumGainDb}
					step="0.1"
					with-tooltip
					aria-label=${`${strip.name} gain`}
					.value=${gainDb}
					.valueFormatter=${(db: number) => `${db.toFixed(1)} dB`}
					@change=${(event: Event) => onCommitGain(strip, event)}
				></wa-slider>
				<div class="meter" aria-hidden="true">
					<div style="height: ${strip.level}%"></div>
				</div>
			</div>

			<footer>
				<span>${strip.count}</span>
			</footer>
		</section>
	`
}

