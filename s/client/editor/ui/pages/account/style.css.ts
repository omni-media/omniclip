import {css} from "lit"

export default css`@layer view {

:host {
	display: block;
	min-height: 100%;
	background: #0f0f0f;
	color: #ccc;
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	text-shadow: none;
}

main {
	display: grid;
	justify-items: center;
	padding: 56px 24px;
}

.account-page {
	width: min(100%, 560px);
	display: grid;
	gap: 24px;
}

.page-heading {
	display: grid;
	gap: 18px;

	a {
		width: fit-content;
		color: #888;
		font-size: 13px;
	}
}

h1 {
	font-size: 26px;
	font-weight: 500;
	letter-spacing: -0.03em;
	color: #eee;
}

h2 {
	font-size: 21px;
	font-weight: 500;
	letter-spacing: -0.025em;
	color: #eee;
}

p {
	font-size: 14px;
	line-height: 1.6;
	color: #999;
}

.identity {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding-bottom: 24px;
	border-bottom: 1px solid #262626;

	> div {
		min-width: 0;
	}
}

.eyebrow {
	color: #838383;
	font-size: 11px;
	font-weight: 500;
	letter-spacing: 0.07em;
	text-transform: uppercase;
}

.email {
	color: #ccc;
	overflow-wrap: anywhere;
}

button {
	padding: 10px 16px;
	border: 1px solid #333;
	border-radius: 7px;
	background: #202020;
	color: #ddd;
	font: inherit;
	font-size: 13px;
	font-weight: 500;
	line-height: 1.4;
	cursor: pointer;
	transition: background 0.12s ease;

	&:hover {
		background: #303030;
	}

	&.primary {
		background: #e4e4e4;
		border-color: #e4e4e4;
		color: #171717;
	}

	&.primary:hover {
		background: #fff;
		border-color: #fff;
	}

	&.quiet {
		flex-shrink: 0;
		border-color: transparent;
		background: transparent;
		color: #999;
	}

	&.quiet:hover {
		color: #eee;
		background: #202020;
	}

	&:disabled {
		opacity: 0.5;
		cursor: wait;
	}
}

button:focus-visible, a:focus-visible, summary:focus-visible {
	outline: 2px solid #999;
	outline-offset: 3px;
}

a {
	color: #bbb;
	font-size: 14px;
}

.note {
	font-size: 12px;
	color: #707070;
}

.error {
	color: #e19a9a;
}

.plan-card {
	display: grid;
	gap: 20px;
	padding: 28px;
	border: 1px solid #2b2b2b;
	border-radius: 12px;
	background: #171717;
}

.plan-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;

	.eyebrow {
		margin-bottom: 5px;
	}
}

.plan-description {
	margin: 0;
	font-size: 13px;
	line-height: 1.7;
	color: #aaa;
}

.badge {
	padding: 4px 9px;
	border: 1px solid #3c4841;
	border-radius: 20px;
	color: #b0c8b8;
	background: #202a24;
	font-size: 11px;
	white-space: nowrap;
}

.plan-meta {
	margin-top: -9px;
	color: #949494;
	font-size: 13px;
}

.credit-balances {
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 20px 0;
	border-top: 1px solid #2b2b2b;
	border-bottom: 1px solid #2b2b2b;

	> div {
		display: grid;
		gap: 5px;
	}

	> div + div {
		padding-left: 24px;
		border-left: 1px solid #2b2b2b;
	}

	.credit-total {
		grid-column: 1 / -1;
		padding-bottom: 18px;
		margin-bottom: 18px;
		border-bottom: 1px solid #2b2b2b;
	}

	.credit-total + div {
		padding-left: 0;
		border-left: 0;
	}

	strong {
		color: #eee;
		font-size: 34px;
		font-weight: 500;
		line-height: 1.1;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
	}

	span {
		color: #999;
		font-size: 12px;
	}
}

.plan-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.plan-price {
	display: flex;
	align-items: baseline;
	gap: 7px;

	strong {
		color: #eee;
		font-size: 34px;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	span {
		font-size: 13px;
		color: #888;
	}
}

.plan-features {
	display: grid;
	gap: 12px;
	padding: 0;
	list-style: none;
	color: #b0b0b0;
	font-size: 13px;

	li::before {
		content: "✓";
		display: inline-block;
		width: 23px;
		color: #888;
	}

	strong {
		color: #ddd;
		font-weight: 500;
	}
}

.subscribe {
	margin-top: 4px;
}

.checkout-note {
	margin-top: -10px;
	text-align: center;
	font-size: 12px;
	color: #888;
}

.retained-credits {
	padding: 12px;
	border-radius: 6px;
	background: #222;
	font-size: 12px;
}

.credit-details {
	color: #999;
	font-size: 13px;

	summary {
		width: fit-content;
		cursor: pointer;
		color: #b5b5b5;
	}

	dl {
		display: grid;
		gap: 14px;
		margin: 20px 0 14px;
	}

	dl > div {
		display: grid;
		grid-template-columns: 135px 1fr;
		gap: 16px;
		line-height: 1.6;
	}

	dt {
		color: #ccc;
	}

	dd {
		color: #929292;
	}
}

.credit-details p, .free-note {
	font-size: 12px;
	color: #888;
}

.free-note {
	padding-top: 20px;
	border-top: 1px solid #262626;
}

@media (max-width: 480px) {
	main {
		padding: 40px 20px;
	}

	.plan-card {
		padding: 22px;
	}

	.plan-actions {
		flex-direction: column;
	}

	.credit-details dl > div {
		grid-template-columns: 1fr;
		gap: 3px;
	}
}

}`
