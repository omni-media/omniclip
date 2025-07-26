import {css} from "@benev/slate"

export default css`
footer {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	height: 400px;
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
	margin-top: 5em;
}

footer::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(to top, rgba(0,0,0,0) 80%, #000 100%);
}

.logo {
	position: absolute;
	display: flex;
	font-size: 15em;
	font-weight: bold;
	align-self: center;
	font-family: sans-serif;
	color: black;
	-webkit-text-stroke: 1px #121212;
}

.creator-credit {
	display: flex;
	z-index: 2;
	color: white;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1em;
}

.github-link {
	display: flex;
	align-items: center;
	gap: 0.5em;
	color: black;
	background: white;
	padding: 0.2em 0.5em;
	border-radius: 10px;
}

.glow {
	background: conic-gradient(
		from 180deg,
		rgb(13, 13, 13) 0deg,
		rgb(13, 13, 13) 120.07deg,
		rgb(13, 13, 13) 179.52deg,
		rgb(13, 13, 13) 241.65deg,
		rgb(13, 13, 13) 299.6deg,
		rgb(0, 0, 0) 360deg);
  border-radius: 50%;
  font-size: 150px;
  height: 0.8em;
  width: 1.5em;
  filter: blur(32px);
  position: absolute;
  z-index: 2;
}
`
