
import {html} from "lit"
import {shadow, useCss} from "@e280/sly"

import styleCss from "./style.css.js"

const features = [
	["Magnetic timeline", "Delete a clip, everything closes up automatically."],
	["Keyframes", "Animate position, scale, rotation, opacity over time."],
	["Split & trim", "Cut at the playhead, drag edges, roll between clips."],
	["Filters & effects", "Non-destructive, stackable, keyframeable."],
	["Audio waveforms", "Rendered per clip so you can see what you're cutting."],
	["On-canvas transform", "Drag clips directly in the viewport to reposition."],
	["Undo everything", "Full history stack, no checkpoints, no limits."],
	["Project persistence", "Your work saves locally between sessions."],
]

export const Features = shadow(() => {
	useCss(styleCss)

	return html`
		<section>
			<div class="label">What's working right now</div>

			<p>
				The core editing workflow is solid. You can bring in footage, build a timeline,
				and export. It's not a demo, it's the real thing.
			</p>

			<div class="feat-grid">
				${features.map(([title, body]) => html`
					<div class="feat-item">
						<b>${title}</b>
						${body}
					</div>
				`)}
			</div>

			<p>
				Theres more things you can do with this video editor, theres currently no tutorials
				on how to use it, but theres little ai chat box where you can ask questions about
				omniclip, hopefully it will serve you well.
			</p>
		</section>
	`
})

