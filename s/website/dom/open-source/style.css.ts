import {css} from "@benev/slate"

export default css`
section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 4rem 1rem;
	color: #ddd;
	z-index: 2;
}

h2 {
	margin-bottom: 0.5em;
	font-weight: 700;
	color: white;
}

.subtitle {
	margin-bottom: 3rem;
	text-align: center;
	color: #aaa;
	line-height: 1.4;
}

.row {
	display: flex;
	gap: 3em;
	flex-wrap: wrap;
	justify-content: center;
}

.license {
	display: flex;
	flex-direction: column;
	gap: 1em;
	padding: 2em;
	border-radius: 12px;
	background: rgba(255,255,255,0.04);
	border: 1px solid rgba(255,255,255,0.08);
	box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.6);
	backdrop-filter: blur(8px);
	color: #ccc;
	min-width: 250px;
}

.license span {
	font-size: 0.85rem;
	background: rgba(255,255,255,0.06);
	padding: 0.25em 0.75em;
	border-radius: 6px;
	color: #fff;
	font-weight: 600;
	letter-spacing: 0.05em;
	align-self: start;
}

ul {
	display: flex;
	flex-direction: column;
	gap: 0.75em;
	list-style: none;
	padding: 0;
	margin: 0;
}

ul li::before {
	content: "✔";
	color: white;
	display: inline-block;
	margin-right: 0.75em;
	font-size: 1em;
}

.text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 400px;
	gap: 1em;
}

.text p {
	line-height: 1.6;
	color: #bbb;
}

.text button {
	display: flex;
	align-items: center;
	gap: 0.5em;
	align-self: start;
	padding: 0.75em 1.5em;
	background: rgba(255,255,255,0.04);
	border: 1px solid rgba(255,255,255,0.08);
	color: white;
	border-radius: 8px;
	font-size: 0.9rem;
	font-family: inherit;
	transition: background 0.2s;
	cursor: pointer;
}

.text button:hover {
	background: #161b22;
}

`
