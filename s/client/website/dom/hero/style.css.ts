import {css} from "lit"

export default css`
*, *::before, *::after { box-sizing: border-box; }

:host {
	display: block;
	min-height: 100svh;
	overflow: hidden;
	background:
		radial-gradient(circle at 50% 58%, #335dff18, transparent 35em),
		#050609;
}

main {
	width: 100%;
	min-height: 100svh;
	padding: 0 clamp(1em, 3vw, 3em) clamp(1.5em, 4vw, 4em);
}

nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: min(100%, 1384px);
	height: 68px;
	margin: 0 auto;
}

a {
	color: #aaa;
	text-decoration: none;
}

a:hover {
	color: white;
	text-decoration: none;
}

.brand, .nav-actions, .actions {
	display: flex;
	align-items: center;
}

.brand {
	flex: 0 0 auto;
	gap: 0.55em;
	color: #f5f5f6;
	font-size: var(--font-size-m);
	font-weight: 650;
}

.brand img {
	width: 28px;
	height: 28px;
	object-fit: contain;
}

.version {
	padding: 0.2em 0.5em;
	border-radius: 5px;
	background: #ffffff0a;
	box-shadow: inset 0 0 0 1px #ffffff14;
	color: #888b93;
	font-size: 0.7em;
	font-weight: 500;
}

.nav-actions {
	gap: 1.5em;
	font-size: var(--font-size-s);
}

.hero {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.copy {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: clamp(3em, 7vh, 5.5em) 0 clamp(2.5em, 6vh, 4.5em);
	text-align: center;
}

h1 {
	max-width: 13ch;
	color: #f7f7f8;
	font-size: clamp(2.25rem, 4.2vw, 4rem);
	font-weight: 600;
	letter-spacing: -0.055em;
	line-height: 1.04;
}

p {
	margin-top: 1em;
	color: #898c94;
	font-size: clamp(var(--font-size-s), 1.5vw, var(--font-size-l));
}

.actions {
	gap: 1.35em;
	margin-top: 1.6em;
	font-size: var(--font-size-s);
}

.discord {
	display: flex;
	align-items: center;
	gap: 0.45em;
	padding: 0.75em 0.2em;
}

.discord svg {
	width: 1.25em;
	height: 1.25em;
}

.primary {
	padding: 0.75em 1.4em;
	border-radius: 7px;
	background: #1676f3;
	box-shadow: 0 10px 35px #126ce730;
	color: white;
	font-weight: 600;
}

.primary:hover { background: #2c88ff; }

.editor {
	width: min(100%, 1384px);
	overflow: hidden;
	border: 1px solid #ffffff1a;
	border-radius: 10px;
	background: #111;
	box-shadow:
		0 35px 100px #000a,
		0 0 90px #315dff13;
}

.editor img {
	display: block;
	width: 100%;
	height: auto;
}

.credit {
	margin-top: clamp(2.5em, 5vw, 4.5em);
	color: #62656d;
	font-size: var(--font-size-xs);
}

.credit a {
	margin-left: 0.3em;
	color: #999ca4;
}

@media (max-width: 600px) {
	main { padding-inline: 0.8em; }
	nav { height: 58px; }
	.github { display: none; }
	.copy { padding: 3.5em 0 3em; }
	h1 { font-size: clamp(2.2rem, 11vw, 3.25rem); }
	p { max-width: 24em; }
	.editor { border-radius: 6px; }
}

@media (max-width: 420px) {
	.actions { flex-direction: column; gap: 1em; }
	.actions .primary { order: -1; }
}
`

