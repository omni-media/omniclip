
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"
import {Kind} from "@omnimedia/omnitool"
import {repeat} from "lit/directives/repeat.js"

import styleCss from "./style.css.js"
import {useMixerLevels} from "./levels.js"
import themeCss from "../../../../../../theme.css.js"
import {MixerStrip, renderMixerStrip} from "./strip.js"
import {gainFromDb, masterStrip, meterHeight} from "./utils.js"
import {EditorContext} from "../../../../../../context/context.js"

import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/slider/slider.js"

export const MixerTab = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const {outliner} = context.strata
	const lookup = context.session.roles.lookup
	const {levels, masterLevel, masterGain} = useMixerLevels(context)

	const roleLevels = levels()
	const audioItemCount = context.strata.timeline.state.items
		.filter(item => item.kind === Kind.Audio).length
	const audioRoles = lookup.roles.filter(role => role.scope === "audio")

	const strips: MixerStrip[] = [...audioRoles.map(role => ({
		id: role.id,
		name: role.name,
		color: role.color,
		gain: role.gain,
		disabled: !lookup.enabled(role.id),
		level: lookup.enabled(role.id) ? meterHeight(roleLevels.get(role.id) ?? 0) : 0,
		count: outliner.state.items.filter(item => lookup.familyIds(role.id).includes(item.roleId)).length
	})), masterStrip(masterGain(), masterLevel(), audioItemCount)]

	const commitGain = (strip: MixerStrip, event: Event) => {
		const gain = gainFromDb(Number((event.currentTarget as HTMLInputElement).value))
		if (strip.id === null)
			context.session.roles.setMasterGain(gain)
		else
			context.session.roles.setGain(strip.id, gain)
	}

	return html`
		<div class="mixer">
			<header>
				<h3>Audio Mixer</h3>
			</header>

			<div class="strips">
				${repeat(strips, strip => strip.id ?? "master", strip => renderMixerStrip({
					strip,
					onCommitGain: commitGain,
					onToggle: strip => context.session.roles.toggle(strip.id!)
				}))}
			</div>
		</div>
	`
})

