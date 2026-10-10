
import {html} from "lit"
import {shadow, useCss, useSignal} from "@e280/sly"
import {
	Id,
	animationPresets
} from "@omnimedia/omnitool"

import styleCss from "./style.css.js"
import {valueOf} from "../filters/utils.js"
import {controlsStyles} from "../styles.css.js"
import filterStyleCss from "../filters/style.css.js"
import {EditorContext} from "../../../../../../../../../context/context.js"
import {remove} from "../../../../../../../../logic/parts/mutate.js"
import {getPresetEntries, PresetChoice, PresetDirection, PresetItem, seconds} from "./utils.js"

import "@awesome.me/webawesome/dist/components/number-input/number-input.js"

export const AnimationsControls = shadow((context: EditorContext, item: PresetItem) => {
	useCss(controlsStyles, filterStyleCss, styleCss)

	const tool = context.omni
	const defaultDuration = animationPresets.fadeIn.defaults.duration
	const maxDuration = Math.max(0.1, item.duration / 1000)

	const enterPreset   = useSignal<PresetChoice>("none")
	const exitPreset    = useSignal<PresetChoice>("none")
	const enterDuration = useSignal<number>(defaultDuration)
	const exitDuration  = useSignal<number>(defaultDuration)
	const enterAnimId   = useSignal<Id | null>(null)
	const exitAnimId    = useSignal<Id | null>(null)

	const presetSignals = {
		enter: {preset: enterPreset, duration: enterDuration, animId: enterAnimId},
		exit:  {preset: exitPreset,  duration: exitDuration,  animId: exitAnimId},
	}

	const syncAnimIds = (enterId = enterAnimId(), exitId = exitAnimId(), ...staleIds: (Id | null)[]) => {
		const owned = new Set([enterAnimId(), exitAnimId(), ...staleIds].filter((id): id is Id => id != null))
		tool.set<PresetItem>(item.id, {
			animationIds: [
				...(item.animationIds ?? []).filter(id => !owned.has(id)),
				...[enterId, exitId].filter((id): id is Id => id != null),
			],
		})
	}

	const applySlot = (direction: PresetDirection, preset: PresetChoice, duration: number, offset: number) => {
		const {animId} = presetSignals[direction]
		const prevId = animId()
		animId(preset === "none"
			? null
			: tool.animate.presets[preset].make({
				duration: Math.min(duration, item.duration),
				offset,
			}).id)

		syncAnimIds(
			direction === "enter" ? animId() : enterAnimId(),
			direction === "exit"  ? animId() : exitAnimId(),
			prevId,
		)

		if (prevId != null)
			context.strata.timeline.mutate(state => remove(state, prevId))
	}

	const applyPresets = (enter: PresetChoice, exit: PresetChoice, prev: PresetChoice[] = []) => {
		if (enter !== "none" || prev[0] !== "none")
			applySlot("enter", enter, enterDuration(), 0)

		if (exit !== "none" || prev[1] !== "none")
			applySlot("exit", exit, exitDuration(), Math.max(0, item.duration - exitDuration()))
	}

	const choosePreset = (direction: PresetDirection, preset: PresetChoice) => {
		const prev = [enterPreset(), exitPreset()]
		presetSignals[direction].preset(preset)
		applyPresets(enterPreset(), exitPreset(), prev)
	}

	const setDuration = (direction: PresetDirection, event: Event) => {
		const {duration} = presetSignals[direction]
		const n = Number(valueOf(event))
		duration(Number.isFinite(n)
			? Math.round(Math.min(maxDuration, Math.max(0.1, n)) * 1000)
			: duration())
		applyPresets(enterPreset(), exitPreset())
	}

	const renderMode = (direction: PresetDirection) => {
		const signals = presetSignals[direction]
		const active = signals.preset()
		const duration = signals.duration()
		return html`
			<div class="animation-mode">
				<div class="mode-heading ${direction}">${direction}</div>

				<div class="preset-grid">
					<button type="button" class="preset-button" ?data-active=${active === "none"}
						@click=${() => choosePreset(direction, "none")}>None</button>

					${getPresetEntries(direction).map(([name, preset]) => html`
						<button type="button" class="preset-button" ?data-active=${active === name}
							@click=${() => choosePreset(direction, name)}>${preset.label}</button>
					`)}
				</div>

				<div class="duration-row">
					<div class="duration-label">Duration</div>
					<wa-number-input class="duration-input" size="small"
						min="0.1" max=${maxDuration} step="0.1"
						.value=${String(seconds(duration))}
						@input=${(event: Event) => setDuration(direction, event)}
					></wa-number-input>
					<div class="duration-unit">s</div>
				</div>
			</div>
		`
	}

	return html`
		<div class="effects-panel">
			<div class="controls-group section">
				<h4 class="heading">Animations</h4>
				${renderMode("enter")}
				${renderMode("exit")}
			</div>
		</div>
	`
})

