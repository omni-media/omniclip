import {css} from "@benev/slate"

export const styles = css`
	:host {}

	.flex {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
		flex-direction: column;
	}

	canvas {
		height: 100% !important;
		width: 100% !important;
	}

	.lower-canvas {
		background: rgb(32, 31, 31);
	}

	.canvas-container {
		position: relative;
		aspect-ratio: 16/9;
		height: 100%;
	}

	.upper-canvas {
		z-index: 100;
	}

	figure {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16/9;
		display: flex;
		justify-content: center;
		margin: 1em;
	}
	
	video {
		width: 100%;
	}

	.controls {
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 1em;
		right: 1em;
		width: 100%;
		margin: 0.5em;
		z-index: 999;

		& button {
			display: flex;
			align-items: center;
		}

		& .fs {
			position: absolute;
			right: 0;
		}
	}

	.controls[data-state="hidden"] {
		display: none;
	}

	.controls[data-state="visible"] {
		display: block;
	}

	.controls > * {
		float: left;
		width: 3.90625%;
		height: 100%;
		margin-left: 0.1953125%;
		display: block;
	}

	.controls > *:first-child {
		margin-left: 0;
	}

	.controls .progress {
		cursor: pointer;
		width: 75.390625%;
	}

	.controls button {
		border: none;
		cursor: pointer;
		background: transparent;
		background-size: contain;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
	}

	.controls button:hover,
	.controls button:focus {
		opacity: 0.5;
	}

	.controls button[data-state="play"] {
		background-image: url("data:image/png;base64,iVBORw0KGgoAAA…");
	}

	.controls button[data-state="pause"] {
		background-image: url("data:image/png;base64,iVBORw0KGgoAAA…");
	}

	.controls progress {
		display: block;
		width: 100%;
		height: 81%;
		margin-top: 0.125rem;
		border: none;
		color: #0095dd;
		-moz-border-radius: 2px;
		-webkit-border-radius: 2px;
		border-radius: 2px;
	}

	.controls progress::-moz-progress-bar {
		background-color: #0095dd;
	}

	.controls progress::-webkit-progress-value {
		background-color: #0095dd;
	}

	@media screen and (max-width: 64em) {
		figure {
			padding-left: 0;
			padding-right: 0;
			height: auto;
		}

		.controls {
			height: 1.876rem;
		}
	}

	@media screen and (max-width: 42.5em) {
		.controls {
			height: auto;
		}

		.controls > * {
			display: block;
			width: 16.6667%;
			margin-left: 0;
			height: 2.5rem;
			margin-top: 2.5rem;
		}

		.controls .progress {
			position: absolute;
			top: 0;
			width: 100%;
			float: none;
			margin-top: 0;
		}

		.controls .progress progress {
			width: 98%;
			margin: 0 auto;
		}

		.controls button {
			background-position: center center;
		}
	}
`
