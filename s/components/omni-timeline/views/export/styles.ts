import {css} from "@benev/slate"

export const styles = css`
	:host {
		width: 100%;
		height: 100%;
	}

	canvas {
		position: relative !important;
		width: 500px !important;
		height: 300px !important;
	}

	.flex {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		gap: 0.5em;
		letter-spacing: 0.5px;
	}

	.sparkle-button {
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
	}

	.sparkle-button:active {
		scale: 1;
	}

	.sparkle-button:is(:hover, :focus-visible) {
		--active: 1;
	}

	.export {
		display: flex;
		align-items: center;
		gap: 1em;
		position: absolute;
		bottom: 0;
		right: 0;
		margin: 1em;

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
	}

	dialog {
		width: 100%;
		height: 100%;
		background: none;
		backdrop-filter: blur(5px);
		border: none;
		margin: auto;

		& .box {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;

			canvas {
				width: 500px;
				height: 300px;
				background: #18181894;
			}

			& .flex-col {
				display: flex;
				flex-direction: column;
				height: 300px;
				width: 350px;
				justify-content: space-between;
				background: #18181894;
				padding: 1em;
				font-size: 0.8em;

				& .progress {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 0.3em;
					height: 100%;

					& .logs {
						display: flex;
						align-self: start;
						justify-content: left;
						flex-direction: column;
						overflow: hidden;
						height: 100%;
						width: 100%;
						text-align: left;
						position: relative;

						& .box-logs {
							word-break: break-all;
							position: absolute;
							bottom: 0;
						}

						& span {
							display: block;
							color: green;
							font-size: 8px;
							text-align: left;
						}
					}

					& .logs-txt {
						align-self: start;
						font-size: 10px;
					}

					& .status {}
				}

				& span {
					color: white;
					font-size: 1.2em;
				}
			}
			
			& .save-button {
				margin-top: 1em;
				position: relative;
				display: flex;
				align-self: center;
				justify-content: center;
				width: 150px;
				
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
					translate: -25% 20%;
					color: gray;
				}
				
				.text {
					translate: 0;
					color: #a2a1a1;
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
`
