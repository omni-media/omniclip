import {css} from "lit"

export default css`
.crop-controls .grid {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	max-width: 240px;
	row-gap: 0.5em;
	column-gap: 0.5em;
}

.grid > * {
	flex-basis: calc(33.333% - 0.66em);
	width: 100%;
}

.crop-input {
	width: 100%;
}

.crop-input::part(input) {
	text-align: center;
}

.prefix {
	color: #888;
	font-size: calc(var(--font-size-xs) - 1px);
	text-transform: uppercase;
}
`

