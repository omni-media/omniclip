
import {css} from "@benev/slate"
import {standard_panel_styles} from "@e280/lettuce"

export const styles = css`

${standard_panel_styles}

.plate {
	font-size: 1.5em;

	padding: 2em;
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1em;

	& img {
		max-width: 100%;
		width: 10em;
	}

	h2 {
		font-family: sans-serif;
		font-weight: normal;

		> span:nth-child(1) { font-weight: bold; color: #8f4f; }
		> span:nth-child(2) { font-size: 0.7em; color: #ff0; }
	}
}

`

