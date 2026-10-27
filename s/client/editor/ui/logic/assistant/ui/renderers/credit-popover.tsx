
import type {BillingStatus} from "@omnimedia/omniso/billing"
import WaPopover from "@awesome.me/webawesome/dist/react/popover/index.js"

export function CreditPopover({id, status}: {id: string, status: BillingStatus}) {
	const total = status.monthly + status.purchased
	const end = status.cancelAt ?? status.periodEnd
	const date = end && new Date(end).toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"})
	return <WaPopover className="credit-popover" for={id} placement="top-end" withoutArrow>
		<div className="credit-breakdown">
			<strong>{total} credits left</strong>
			<dl>
				<div><dt>Monthly credits</dt><dd>{status.monthly}</dd></div>
				<div><dt>Purchased credits</dt><dd>{status.purchased}</dd></div>
			</dl>
			{date && <p>{status.cancelAt ? "Monthly credits expire" : "Monthly credits reset"} {date}.</p>}
			<p>Purchased credits expire 12 months after purchase.</p>
			<a href="#/account">Manage credits and subscription</a>
		</div>
	</WaPopover>
}
