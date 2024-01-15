import {css} from "@benev/slate"

export const styles = css`
	canvas {
		width: 500px;
		height: 300px;
		background: rgb(32, 31, 31);
		position: absolute;
	}

	figure {
		position: relative;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 500px;
		height: 300px;
		margin: 1.25rem auto;
		overflow: hidden;
	}
	
	video {
		width: 100%;
	}

	.controls {
		width: 100%;
		height: 8.0971659919028340080971659919028%; /* of figure's height */
		display: flex;
		justify-content: space-evenly;
		position: absolute;
		bottom: 0;
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
