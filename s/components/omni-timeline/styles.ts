import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		overflow: scroll;
		position: relative;
		height: 100%;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		user-select: none;

		& .timeline-relative {
			height: 100%;
			min-width: 100vw;
			position: relative;
			overflow-y: scroll;
			background-color: #111;

			& * {
				will-change: transform;
			}

			& .timeline-info {
				position: fixed;
				display: flex;
				flex-direction: column;
				padding: 1.5em;
				gap: 0.2em;
				font-family: cursive;

				& h3 {
					font-size: 18px;
				}

				& p {
					font-size: 16px;
					color: gray;
					display: flex;
					align-items: center;
					gap: 0.3em;
				}
			}
		}

		& .transition-duration {
			position: absolute;
			z-index: 5;
			background: #0080005e;
			border-radius: 5px;
			border: 1px solid green;
			transition: 0.5s ease all;

			&:first-of-type {
				left: 10px;
				margin-left: -1px;
			}

			&:last-child {
				right: 10px;
				margin-right: -1px;
			}
		}

		& .transition-indicator {
			text-align: center;
			display: flex;
			background: #5b8900;
			border: 2px solid #111;
			border-radius: 5px;
			color: white;
			align-items: center;
			justify-content: center;
			position: absolute;
			width: 20px;
			height: 20px;
			top: 15px;
			left: -10px;
			z-index: 2;
			opacity: 0;
			cursor: pointer;

			&[data-transition] {
				opacity: 1;
				z-index: 5;
			}

			&[data-selected] {

				& svg {
					z-index: 6;
					background: #329032;
				}
			}

			& svg {
				width: 100%;
				height: 100%;
				color: white;
				background: #2d2d2d;
			}

			&:hover {
				opacity: 1;
				z-index: 6;
			}
		}

		& .drop-indicator {
			height: 50px;
			border: green dotted 2px;
			position: absolute;
			background: #0080002e;
			border-radius: 5px;
			top: 0;
			
			&[data-push-effects] {
				width: 10px;
				z-index: 1;
				border: 1px green solid;
				left: -0.5px;
			}
		}
	}
`
