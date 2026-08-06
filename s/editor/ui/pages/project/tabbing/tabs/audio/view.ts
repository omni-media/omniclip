
import {html} from "lit"
import {Kind} from "@omnimedia/omnitool"
import {shadow, useCss, useMount, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../../../../theme.css.js"
import {EditorContext} from "../../../../../../context/context.js"
import {gainFromDb, maximumGainDb, meterHeight, minimumGainDb, sliderDbFromGain} from "../mixer/utils.js"

import "@awesome.me/webawesome/dist/components/slider/slider.js"

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
				.filter(item => item.kind === Kind.Audio)
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

	const meter = meterHeight(muted() ? 0 : peak() * gainFromDb(level()))
	const scale = [12, 6, 0, -6, -12, -18, -24, -30, -36, null, -48, null, -60]

	return html`
		<header>Audio</header>
		<section class="strip">
			<div class="strip-title">
				<strong>Master</strong>
				<span>Master</span>
			</div>
			<button type="button" ?data-active=${muted()} @click=${toggleMute}>M</button>
			<div class="fader">
				<div class="meter" style=${`--level: ${meter}%`}></div>
				<wa-slider
					orientation="vertical"
					min=${minimumGainDb}
					max=${maximumGainDb}
					step="0.1"
					with-tooltip
					aria-label="Master audio level"
					.value=${level()}
					.valueFormatter=${(db: number) => `${db.toFixed(1)} dB`}
					@input=${setLevel}
					@change=${commitAudio}
				></wa-slider>
				<div class="scale" aria-hidden="true">
					${scale.map(value => html`<span>${value ?? ""}</span>`)}
				</div>
			</div>
			<output>${level().toFixed(1)}</output>
		</section>
	`
})

