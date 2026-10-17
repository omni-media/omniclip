
import {AuiIf, ComposerPrimitive} from "@assistant-ui/react"
import WaDropdown from "@awesome.me/webawesome/dist/react/dropdown/index.js"
import WaDropdownItem from "@awesome.me/webawesome/dist/react/dropdown-item/index.js"

import type {ReasoningEffort} from "../parts/runtime.js"

const effortLabels: Record<ReasoningEffort, string> = {
	none: "Off",
	low: "Fast",
	medium: "Balanced",
	xhigh: "Deep",
}

export function ChatComposer({effort, onEffortChange}: {
	effort: ReasoningEffort
	onEffortChange: (value: ReasoningEffort) => void
}) {
	return <div className="composer-area">
		<ComposerPrimitive.Root>
			<ComposerPrimitive.Input autoFocus placeholder="Send a message…" />
			<WaDropdown
				className="thinking-effort"
				onWaSelect={event => onEffortChange(
					(event.detail.item as HTMLElementTagNameMap["wa-dropdown-item"]).value as ReasoningEffort,
				)}>
				<button slot="trigger" type="button" title="Thinking effort for this turn">
					{effortLabels[effort]} <span>⌄</span>
				</button>
				{(Object.keys(effortLabels) as ReasoningEffort[]).map(value =>
					<WaDropdownItem key={value} value={value}>
						<span className="thinking-check">{effort === value ? "✓" : ""}</span>
						{effortLabels[value]}
					</WaDropdownItem>,
				)}
			</WaDropdown>

			<AuiIf condition={state => !state.thread.isRunning}>
				<ComposerPrimitive.Send className="send" title="Send">↑</ComposerPrimitive.Send>
			</AuiIf>
			<AuiIf condition={state => state.thread.isRunning}>
				<ComposerPrimitive.Cancel className="send" title="Stop">■</ComposerPrimitive.Cancel>
			</AuiIf>
		</ComposerPrimitive.Root>
	</div>
}
