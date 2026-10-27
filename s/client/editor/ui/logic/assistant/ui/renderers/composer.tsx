
import {useId} from "react"
import {AuiIf, ComposerPrimitive} from "@assistant-ui/react"
import {billing, type BillingStatus} from "@omnimedia/omniso/billing"
import WaDropdown from "@awesome.me/webawesome/dist/react/dropdown/index.js"
import WaDropdownItem from "@awesome.me/webawesome/dist/react/dropdown-item/index.js"

import {CreditPopover} from "./credit-popover.js"
import type {ReasoningEffort} from "../parts/runtime.js"

const effortLabels: Record<ReasoningEffort, string> = {
	none: "Off",
	low: "Fast",
	medium: "Balanced",
	xhigh: "Deep",
}

export function ChatComposer({effort, onEffortChange, status}: {
	effort: ReasoningEffort
	onEffortChange: (value: ReasoningEffort) => void
	status: BillingStatus
}) {
	const balanceId = useId()
	const total = status.monthly + status.purchased
	const outOfCredits = total < billing.chatCredits
	return <div className="composer-area">
		{outOfCredits && <p className="credit-notice" role="status">
			Out of credits. <a href="#/account">Buy more credits</a> to continue chatting.
		</p>}
		<ComposerPrimitive.Root onSubmit={event => { if (outOfCredits) event.preventDefault() }}>
			<ComposerPrimitive.Input autoFocus placeholder="Send a message…" disabled={outOfCredits} />
			<WaDropdown
				className="thinking-effort"
				onWaSelect={event => onEffortChange(
					(event.detail.item as HTMLElementTagNameMap["wa-dropdown-item"]).value as ReasoningEffort,
				)}>
				<button slot="trigger" type="button" title="Thinking effort for this turn" disabled={outOfCredits}>
					{effortLabels[effort]} <span>⌄</span>
				</button>
				{(Object.keys(effortLabels) as ReasoningEffort[]).map(value =>
					<WaDropdownItem key={value} value={value} disabled={outOfCredits}>
						<span className="thinking-check">{effort === value ? "✓" : ""}</span>
						{effortLabels[value]}
					</WaDropdownItem>,
				)}
			</WaDropdown>

			<button id={balanceId} className="credit-balance" type="button" title="View credit breakdown">{total} credits left</button>
			<AuiIf condition={state => !state.thread.isRunning}>
				<ComposerPrimitive.Send className="send" title={outOfCredits ? "Out of credits" : "Send"} disabled={outOfCredits}>↑</ComposerPrimitive.Send>
			</AuiIf>
			<AuiIf condition={state => state.thread.isRunning}>
				<ComposerPrimitive.Cancel className="send" title="Stop">■</ComposerPrimitive.Cancel>
			</AuiIf>
		</ComposerPrimitive.Root>
		<CreditPopover id={balanceId} status={status} />
	</div>
}
