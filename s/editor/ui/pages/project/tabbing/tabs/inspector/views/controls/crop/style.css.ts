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
	display: flex;
	justify-content: center;
}

.input-group {
	display: flex;
	align-items: center;
	background: #1f1f1f;
	border: 1px solid #333;
	border-radius: 5px;
	overflow: hidden;
	width: 100%;
}

input[type="number"] {
	width: 100%;
	background: transparent;
	border: none;
	color: white;
	padding: 0.5em;
	text-align: center;
	-moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.prefix {
	padding: 0 0.6em;
	color: #888;
	font-size: 0.6em;
}
`

