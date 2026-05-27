
import {css, html} from "lit"
import {Content, light} from "@e280/sly"

import "@awesome.me/webawesome/dist/components/tab/tab.js"
import "@awesome.me/webawesome/dist/components/tab-group/tab-group.js"
import "@awesome.me/webawesome/dist/components/tab-panel/tab-panel.js"

export const itemControlTabsCss = css`
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

export const ItemControlTabs = light((props: {
	properties: Content
	effects: Content
	ai?: Content
}) => {
	return html`
		<wa-tab-group>
			<wa-tab panel="properties">Properties</wa-tab>
			<wa-tab panel="effects">Effects</wa-tab>
			${props.ai ? html`<wa-tab panel="ai">AI</wa-tab>` : null}

			<wa-tab-panel name="properties">
				${props.properties}
			</wa-tab-panel>
			<wa-tab-panel name="effects">
				${props.effects}
			</wa-tab-panel>
			${props.ai ? html`
				<wa-tab-panel name="ai">
					${props.ai}
				</wa-tab-panel>
			` : null}
		</wa-tab-group>
	`
})

