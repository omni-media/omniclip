
import {reactBindings} from "@e280/strata"
import {useEffect, useId, useState} from "react"
import {Clock3Icon, MousePointer2Icon} from "lucide-react"
import {AuiIf, ComposerPrimitive} from "@assistant-ui/react"
import type {BillingStatus} from "@omnimedia/omniso/billing"
import {LexicalComposerInput} from "@assistant-ui/react-lexical"
import WaDropdown from "@awesome.me/webawesome/dist/react/dropdown/index.js"
import WaDropdownItem from "@awesome.me/webawesome/dist/react/dropdown-item/index.js"

import {Mentions} from "./mentions.js"
import {CreditPopover} from "./credit-popover.js"
import {itemLabel} from "../../../utils/item-label.js"
import {formatCredits} from "../../../utils/credits.js"
import type {ReasoningEffort} from "../parts/runtime.js"
import {mentionFormatter} from "../parts/mention-format.js"
import type {EditorContext} from "../../../../../context/context.js"
import {formatTime} from "../../../../pages/project/tabbing/utils/format-time.js"

const {useTracked} = reactBindings({useEffect, useState})

const effortLabels: Record<ReasoningEffort, string> = {
	low: "Fast",
	medium: "Balanced",
	xhigh: "Deep",
}

export function ChatComposer({context, effort, onEffortChange, status}: {
	context: EditorContext
	effort: ReasoningEffort
	onEffortChange: (value: ReasoningEffort) => void
	status: BillingStatus
}) {
	const balanceId = useId()
	const total = status.monthly + status.purchased
	const outOfCredits = total <= 0

	return <div className="composer-area">
		{outOfCredits && <p className="credit-notice" role="status">
			Out of credits. <a href="#/account">Buy more credits</a> to continue chatting.
		</p>}
		<ComposerPrimitive.TriggerPopoverRoot>
		<ComposerPrimitive.Root onSubmit={event => { if (outOfCredits) event.preventDefault() }}>
			<ComposerContext context={context} />
			{outOfCredits
				? <ComposerPrimitive.Input placeholder="Ask anything or @mention media…" disabled />
				: <LexicalComposerInput autoFocus formatter={mentionFormatter} placeholder="Ask anything or @mention media…" />}
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

			<button id={balanceId} className="credit-balance" type="button" title="View credit breakdown">{formatCredits(total)} credits left</button>
			<AuiIf condition={state => !state.thread.isRunning}>
				<ComposerPrimitive.Send className="send" title={outOfCredits ? "Out of credits" : "Send"} disabled={outOfCredits}>↑</ComposerPrimitive.Send>
			</AuiIf>
			<AuiIf condition={state => state.thread.isRunning}>
				<ComposerPrimitive.Cancel className="send" title="Stop">■</ComposerPrimitive.Cancel>
			</AuiIf>
			<Mentions context={context} />
		</ComposerPrimitive.Root>
		</ComposerPrimitive.TriggerPopoverRoot>
		<CreditPopover id={balanceId} status={status} />
	</div>
}

function ComposerContext({context}: {context: EditorContext}) {
	const {playhead, selectedLabel} = useTracked(() => {
		const session = context.session
		const selected = session.index.getItemMaybe(session.$selectedItem())
		return {
			playhead: session.$playhead(),
			selectedLabel: selected && itemLabel(selected),
		}
	})
	return <div className="composer-context">
		<span><Clock3Icon /> Playhead {formatTime(playhead, {milliseconds: true})}</span>
		{selectedLabel && <span className="composer-selection" title={selectedLabel}>
			<MousePointer2Icon /> <span>Selected: {selectedLabel}</span>
		</span>}
	</div>
}

