
import {css, html} from "lit"
import {Content, light, useSignal} from "@e280/sly"

export const itemControlTabsCss = css`
.control-tabs {
	display: flex;
	flex-direction: column;
}

.control-tab-bar {
	display: flex;
	height: 36px;
	gap: 0.2em;
	padding: 0.2em;
	border-bottom: 1px solid #101010;
	background: #1d1d1d;
	box-sizing: border-box;
}

.control-tab {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 0 0.7em;
	color: #9a9a9a;
	background: transparent;
	border: 0;
	border-radius: 0.25em;
	font-size: var(--font-size-xs);
	cursor: pointer;
	transition: background 0.12s ease, color 0.12s ease;
}

.control-tab:hover {
	color: #e8e8e8;
	background: #333;
}

.control-tab[data-active] {
	color: #e8e8e8;
	background: #3f3f3f;
}

.control-tab-panel {
	display: flex;
	flex-direction: column;
}

.muted {
	color: #8f8f8f;
	font-size: var(--font-size-xs);
}
`

type TabId = "properties" | "effects" | "ai"

export const ItemControlTabs = light((props: {
	properties: Content
	effects: Content
	ai?: Content
}) => {
	const activeTab = useSignal<TabId>("properties")
	const tabs = [
		{id: "properties" as const, label: "Properties", content: props.properties},
		{id: "effects" as const, label: "Effects", content: props.effects},
		...(props.ai ? [{id: "ai" as const, label: "AI", content: props.ai}] : []),
	]
	const active = tabs.find(tab => tab.id === activeTab.value) ?? tabs[0]

	return html`
		<div class="control-tabs">
			<nav class="control-tab-bar">
				${tabs.map(tab => html`
					<button
						class="control-tab"
						?data-active=${tab.id === active.id}
						@click=${() => activeTab.value = tab.id}
					>
						${tab.label}
					</button>
				`)}
			</nav>

			<div class="control-tab-panel">
				${active.content}
			</div>
		</div>
	`
})

