
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
	main { display: grid; place-items: center; padding: 64px 24px; }
	.account-card { width: min(100%, 360px); display: grid; gap: 18px; }
	h1 { font-size: 22px; font-weight: 500; color: #e0e0e0; }
	p { font-size: 14px; line-height: 1.6; color: #999; }
	button {
		padding: 12px 18px;
		border: none;
		border-radius: 8px;
		background: #242424;
		color: #ddd;
		font: inherit;
		cursor: pointer;
		transition: background 0.12s ease;
	}
	button:hover { background: #303030; }
	button:disabled { opacity: 0.5; cursor: wait; }
	button:focus-visible, a:focus-visible { outline: 2px solid #999; outline-offset: 3px; }
	a { color: #bbb; font-size: 14px; }
	.note { font-size: 12px; color: #707070; }
	.error { color: #e19a9a; }
}`

