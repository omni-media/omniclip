
import {html} from "lit"
import {Kind} from "@omnimedia/omnitool"
import {shadow, useCss, useMount, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../context/context.js"
import {dbFromGain, gainFromDb, maximumGainDb, meterHeight, minimumGainDb, sliderDbFromGain} from "../mixer/utils.js"

import "@awesome.me/webawesome/dist/components/slider/slider.js"

const scale = [12, 6, 0, -6, -12, -24, -36, -48, -60]

export const AudioPanel = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const timeline = context.strata.timeline
	const audio = timeline.state.audio

	const peak = useSignal(0)
	const muted = useSignal(audio?.enabled === false)
	const level = useSignal(sliderDbFromGain(audio?.gain ?? 1))

	const commitAudio = () => timeline.mutate(timeline => {
		timeline.audio = {
			gain: gainFromDb(level()),
			enabled: !muted(),
		}
	})

	const setLevel = (event: Event) => {
		level(+(event.currentTarget as HTMLInputElement).value)
		muted(false)
	}
	const toggleMute = () => {
		muted(!muted())
		commitAudio()
	}

	useMount(() => {
		const stopLevel = context.player.audio.levels.on(
			() => timeline.state.items
				.filter(item => item.kind === Kind.Audio || item.kind === Kind.Clip)
				.map(item => item.id),
			({peak: value}) => peak(value),
		)
		const stopPlayback = context.session.playback.$isPlaying.on(playing => {
			if (!playing)
				peak(0)
		})
		return () => {
			stopLevel()
			stopPlayback()
		}
	})

	const signal = muted() ? 0 : peak() * gainFromDb(level())
	const peakDb = dbFromGain(signal)
	const meter = meterHeight(signal)

	return html`
		<div class="master-row">
			<strong>Master</strong>
			<button class="mute" type="button" ?data-active=${muted()} @click=${toggleMute}>M</button>
		</div>

		<div class="meter-zone">
			<div class="readout">
				<output>${level().toFixed(1)}</output>
				<span>dB</span>
			</div>

			<div class="meter-grid">
				<wa-slider
					orientation="vertical"
					min=${minimumGainDb}
					max=${maximumGainDb}
					step="0.1"
					with-tooltip
					aria-label="Master audio gain"
					.value=${level()}
					.valueFormatter=${(db: number) => `${db.toFixed(1)} dB`}
					@input=${setLevel}
					@change=${commitAudio}
				></wa-slider>
				<div class="meter">
					<div class="meter-level" style=${`--level: ${meter}%`}></div>
				</div>
				<div class="scale" aria-hidden="true">
					${scale.map(value => html`
						<span
							?data-zero=${value === 0}
							style=${`--position: ${meterHeight(gainFromDb(value))}%`}
						>${value > 0 ? `+${value}` : value}</span>
					`)}
				</div>
			</div>

			<footer>
				<span>Peak <strong>${peakDb} dBFS</strong></span>
			</footer>
		</div>
	`
})

