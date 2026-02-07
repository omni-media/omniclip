import {css} from "@benev/slate"

export const tooltipStyles = css`
	#tooltip {
		display: flex;
		position: fixed;
		width: max-content;
		top: 0;
		left: 0;
		background: #1e1e28;
		color: #a0a0b4;
		border: 1px solid #1e1e28;
		z-index: 105;
		pointer-events: none;
		max-width: 200px;
		border-radius: 5px;
		padding: 0.2em 0.3em;
		font-size: 11px;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		box-shadow: 0 2px 8px rgba(0,0,0,0.4);
	}

	#floating {
		position: absolute;
		width: max-content;
		top: 0;
		left: 0;
	}

	#arrow {
		position: absolute;
	}

	#icon-container {
		display: flex;
		position: relative;
		z-index: 100;

		& > :first-child {
			display: flex;
		}

		& svg {
			pointer-events: none;
		}
	}

	i {
		position:absolute;
		top:100%;
		left:50%;
		margin-left:-12px;
		width:24px;
		height:12px;
		overflow:hidden;
	}

	i::after {
		content:'';
		position:absolute;
		width:12px;
		height:12px;
		left:50%;
		transform:translate(-50%,-50%) rotate(45deg);
		background-color:#1e1e28;
		box-shadow:0 1px 8px rgba(0,0,0,0.5);
	}
`
