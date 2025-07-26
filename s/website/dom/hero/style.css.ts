import {css} from "@benev/slate"

export default css`
.hero {
  position: relative;
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, black 0%, black 50%, black 80%, black 100%);
  background-size:
    64px 64px,
    64px 64px,
    cover;
  background-position: 0 0, 0 0, top;
  background-color: #000;
  min-height: 100vh;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 0;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 80%, #000 100%);
  pointer-events: none;
  z-index: 0;
}

.img-shadow {
	position: absolute;
	width: 100%;
	height: 100%;
}

.hero-bg {
	height: 100%;
	width: 100%;
	pointer-events: none;
}

.hero-content {
	position: relative;
	z-index: 2;
	max-width: 800px;
	width: 100%;
}

.omniclip-title {
	font-size: 4rem;
	font-weight: 800;
	line-height: 1.1;
	letter-spacing: -0.02em;
}

.version-tag {
	position: absolute;
	top: -1.5em;
	right: 8em;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.25em;
	padding: 0.2em 0.4em;
	font-size: 0.65rem;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.6);
	backdrop-filter: blur(6px);
	pointer-events: none;
}

.hero-content .tagline {
	font-size: 1rem;
	letter-spacing: 0.03em;
	opacity: 0.6;
}

.subheadline {
	font-size: 1.1rem;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.85);
	margin-bottom: 4.5em;
}

.subheadline:after {
	content: "";
  position: absolute;
  bottom: 105px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: white;
  border-radius: 3px;
}

.buttons {
	display: flex;
	gap: 1em;
	justify-content: center;
	flex-wrap: wrap;
}

.btn {
	display: flex;
	align-items: center;
	padding: 0.75em 1.5em;
	border-radius: 7px;
	text-decoration: none;
	font-weight: 500;
	transition: background 0.3s ease, color 0.3s ease;
	font-size: 1rem;
}

.btn.editor {
	background: white;
	color: black;
}

.btn.discord {
	display: flex;
	gap: 0.7em;
	background: black;
	border: 1px solid white;
	color: white;

		& sl-icon {
			font-size: 20px;
	}
}

.btn.editor:hover {
	background: #e1e1e1;
}

.btn.discord:hover {
	background: rgba(255, 255, 255, 0.1);
}
`

