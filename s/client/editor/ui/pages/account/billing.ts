
import {html} from "lit"
import {billing} from "@omnimedia/omniso/billing"

import type {BillingAction} from "./actions.js"
import type {BillingData, Pricing} from "./access.js"

export function renderBilling({billing: data, busy, manageBilling}: {
	billing: BillingData
	busy: boolean
	manageBilling: (action: BillingAction) => Promise<void>
}) {
	const {status, prices} = data

	if (!status) return html`<section class="plan-card"><p role="status">Loading subscription…</p></section>`

	const proPrice = formatPrice(prices?.pro)
	const topUpPrice = formatPrice(prices?.topUp)
	const endDate = status.cancelAt ?? status.periodEnd
	const renewal = endDate
		? new Date(endDate).toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"})
		: ""

	return html`
		<section class="plan-card" aria-labelledby="plan-title">
			<div class="plan-heading">
				<div>
					<p class="eyebrow">Cloud AI</p>
					<h2 id="plan-title">Omniclip Pro</h2>
				</div>
				${status.active ? html`<span class="badge">${status.cancelAt ? "Ends soon" : "Active"}</span>` : null}
			</div>
			<p class="plan-description">
				An AI editing assistant that sees and hears your footage.
				It understands video frames, speech, music, and sound cues
				to help you find key moments and shape your edit.
			</p>
			${status.active ? html`
				<p class="plan-meta">${proPrice ? `${proPrice} / month · ` : ""}${status.cancelAt ? "Access ends" : "Renews"} ${renewal}</p>
				<div class="credit-balances" aria-label="Available credits">
					<div class="credit-total">
						<strong>${status.monthly + status.purchased}</strong>
						<span>Credits left</span>
					</div>
					<div><strong>${status.monthly}</strong><span>Monthly credits</span></div>
					<div><strong>${status.purchased}</strong><span>Purchased credits</span></div>
				</div>
				<div class="plan-actions">
					<button class="primary" ?disabled=${busy} @click=${() => manageBilling("credits")}>
						Buy ${billing.topUpCredits} credits${topUpPrice ? ` · ${topUpPrice}` : ""}
					</button>
					<button ?disabled=${busy} @click=${() => manageBilling("manage")}>
						Manage subscription
					</button>
				</div>
			` : html`
				${proPrice ? html`
					<p class="plan-price"><strong>${proPrice}</strong><span>/ month</span></p>
				` : null}
				<ul class="plan-features">
					<li><strong>${billing.monthlyCredits} credits</strong> every month</li>
					<li>AI chat and video analysis</li>
					<li>Credit top-ups when you need more</li>
				</ul>
				${status.purchased ? html`
					<p class="retained-credits">
						Your ${status.purchased} purchased credits are available when you resubscribe.
					</p>
				` : null}
				<button class="primary subscribe" ?disabled=${busy} @click=${() => manageBilling("subscribe")}>
					Subscribe to Pro
				</button>
				<p class="checkout-note">Billed monthly. Cancel renewal anytime.${!proPrice ? " Pricing shown at checkout." : ""}</p>
			`}
		</section>
		<details class="credit-details">
			<summary>How credits work</summary>
			<dl>
				<div><dt>AI chat</dt><dd>${billing.chatCredits} credit per request</dd></div>
				<div><dt>Video analysis</dt><dd>${billing.videoCredits} credits per request</dd></div>
				<div><dt>Monthly credits</dt><dd>Reset at renewal. Unused credits don’t roll over.</dd></div>
				<div><dt>Purchased credits</dt><dd>Valid for 12 months. An active subscription is required to buy and use them.</dd></div>
			</dl>
			<p>An AI task can make several requests. Credits closest to expiration are used first.</p>
		</details>
		<p class="free-note">Editing, exports, and local MCP are always free.</p>
	`
}

function formatPrice(price?: Pricing["pro"]) {
	if (price?.amount == null) return ""

	return new Intl.NumberFormat(undefined, {
		style: "currency", currency: price.currency,
	}).format(price.amount / 100)
}
