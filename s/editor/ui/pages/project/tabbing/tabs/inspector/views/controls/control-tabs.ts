
import {css, html} from "lit"
import {Content, shadow, useCss} from "@e280/sly"

import "@awesome.me/webawesome/dist/components/tab/tab.js"
import "@awesome.me/webawesome/dist/components/tab-group/tab-group.js"
import "@awesome.me/webawesome/dist/components/tab-panel/tab-panel.js"

const styleCss = css`
wa-tab-group::part(body) {
	padding-top: 1rem;
}

wa-tab-group::part(nav) {
	border-bottom: 1px solid #222935;
}

wa-tab::part(base) {
	font-size: var(--font-size-xs);
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: #8e96a6;
}

wa-tab[active]::part(base) {
	color: #eef7ff;
}

.muted {
	color: #8e96a6;
	font-size: var(--font-size-s);
}
`

export const ItemControlTabs = shadow((props: {
	properties: Content
	effects: Content
	ai?: Content
}) => {
	useCss(styleCss)

	return html`
		<wa-tab-group>
			<wa-tab panel="properties">Properties</wa-tab>
			<wa-tab panel="effects">Effects</wa-tab>
			<wa-tab panel="ai">AI</wa-tab>

			<wa-tab-panel name="properties">
				${props.properties}
			</wa-tab-panel>
			<wa-tab-panel name="effects">
				${props.effects}
			</wa-tab-panel>
			<wa-tab-panel name="ai">
				${props.ai ?? html`
					<div class="controls-group">
						<p class="muted">AI controls are not wired yet.</p>
					</div>
				`}
			</wa-tab-panel>
		</wa-tab-group>
	`
})

