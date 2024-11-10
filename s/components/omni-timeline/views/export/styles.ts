import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		overflow-y: scroll;
		width: 100%;
		height: 100%;
	}

	canvas {
		position: relative !important;
		width: 500px !important;
		height: 300px !important;
	}

	.selected-settings {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em 0 1em 1em;
	}

	.bitrate {
		background: transparent;
		color: gray;
		border: 1px solid gray;
		padding: 0.3em;
	}

	.setting-container {
		& .error {
			color: red;
			font-size: 11px;
		}
	}


	.aspect-ratios {
		display: flex;
		gap: 0.3em;
		flex-direction: column;

		& .cnt {
			display: flex;
			max-width: 100px;
			width: 100%;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			gap: 0.3em;
			color: gray;

			& .aspect-ratio {
				font-size: 0.9em;
			}

			& .info {
				font-size: 0.8em;
			}

			& .shape {
				height: 50px;
				border-radius: 5px;
				border: 1px solid;
				margin-bottom: 0.5em;
			}
		}
	}

	.sparkle-button {
		align-self: start;
		--active: 0;
		background: #1d1c1c;
		cursor: pointer;
		padding: 0.3em 1em;
		border-radius: 5px;
		box-shadow:
			0 0 calc(var(--active) * 0.6em) calc(var(--active) * 0.1em) hsl(0 0% 61% / 0.75),
			0 0.05em 0 0 hsl(0 calc(var(--active) * 0%) calc((var(--active) * 50%) + 30%)) inset,
			0 -0.05em 0 0 hsl(0 calc(var(--active) * 0%) calc(var(--active) * 60%)) inset;
		transition: all 0.3s ease;

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
		}
	}

	.sparkle-button:active {
		scale: 1;
	}

	.sparkle-button:is(:hover, :focus-visible) {
		--active: 1;
	}

	.export {
		display: flex;
		flex-direction: column;
		align-self: start;
		margin: 1em;

		& span {
			font-size: 0.8em;
		}

		& p {
			display: flex;
			align-items: center;
			gap: 0.3em;
			margin: 0.5em 0em 1em 0;
			font-size: 15px;
		}

		& .info {
			font-size: 0.8em;
		}
	}

	@keyframes float-out {
		to {
			rotate: 360deg;
		}
	}

	.text {
		display: flex;
		align-items: center;
		translate: 0;
		gap: 0.2em;

		& span {
			font-size: 1em;
		}
	}

	dialog {
		width: 100%;
		height: 100%;
		background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), #ffffff -80%, transparent), radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #431eaf -52%, transparent), #000000;
		border: none;
		margin: auto;

		& .box {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: 100%;
			gap: 1em;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			& .progress {
				display: flex;
				flex-direction: column;
				gap: 0.2em;
				margin-top: 1em;
				color: white;

				& .stats {
					display: flex;
					justify-content: space-between;
				}

				& .buttons {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 1em;

					& .cancel {
						color: white;
						background: linear-gradient(47deg, rgba(36, 0, 7, 1) 0%, rgba(201, 38, 38, 1) 100%);
						width: 150px;
						height: 35px;
						cursor: pointer;

						&[data-complete] {
							background: linear-gradient(47deg, rgb(0, 36, 4) 0%, rgb(6, 147, 10) 100%);
						}
					}
				}

				& .progress-bar {
					width: 500px;
					height: 10px;
					border: 1px solid white;
					border-radius: 10px;

					& .bar {
						border-radius: 10px;
						filter: blur(2px);
						height: 8px;
						background: white;
					}
				}
			}

			canvas {
				width: 500px;
				height: 300px;
				background: black;
				box-shadow: black 0px 0px 30px 10px;
			}

			& .save-button {
				position: relative;
				display: flex;
				align-self: end;
				justify-content: center;
				width: 150px;
				height: 35px;
				
				&:disabled {
					opacity: 0.5;
					cursor: progress;
					box-shadow: none;

					& .spark {
						display: none;
					}
				}

				& svg {
					width: 15px;
					translate: -25% 35%;
					color: white;
				}
				
				.text {
					translate: 0;
					color: white;
					font-size: 1.4em;
				}

				.backdrop {
					position: absolute;
					inset: 0.1em;
					background: inherit;
					border-radius: 5px;
					transition: background 0.25s;
				}

				& .spark {
					display: block;
					position: absolute;
					inset: 0;
					border-radius: 5px;
					rotate: 0deg;
					overflow: hidden;
					mask: linear-gradient(white, transparent 50%);
					animation: flip calc(1.8s * 2) infinite steps(2, end);
				}

				.spark:before {
					content: "";
					position: absolute;
					width: 200%;
					aspect-ratio: 1;
					top: 0%;
					left: 50%;
					z-index: -1;
					translate: -50% -15%;
					rotate: 0;
					transform: rotate(-90deg);
					opacity: calc((var(--active)) + 0.4);
					background: conic-gradient(
						from 0deg,
						transparent 0 340deg,
						white 360deg
					);
					transition: opacity 0.25s;
					animation: rotate 1.8s linear infinite both;
				}
			}
		}
	}

	dialog:modal {
		max-width: 100vw;
		max-height: 100vh;
	}

	@keyframes flip {
		to {
			rotate: 360deg;
		}
	}

	@keyframes rotate {
		to {
			transform: rotate(90deg);
		}
	}

	@keyframes g-3 {
		50% {
			--g3-1-x-position: 42.69531250000001%;
			--g3-1-y-position: 91.5625%;
			--g3-2-x-position: 91.7578125%;
			--g3-2-y-position: 33.046875%;
			--g3-3-x-position: 5.742187500000001%;
			--g3-3-y-position: 5.546875000000001%;
		}
	}
`
