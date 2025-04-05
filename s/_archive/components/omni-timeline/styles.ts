import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		flex-direction: column;
		overflow: scroll;
		position: relative;
		height: 100%;
		background: rgb(26, 26, 26);
	}

	.timeline {
		display: flex;
		flex-direction: column;
		user-select: none;

		& .flex {
			display: flex;

			& .add-track {
				position: sticky;
				left: 0;
				z-index: 800;
				font-family: "Nippo-Regular";
				color: #fff;
				border: 1px solid #111;
				background-image: -webkit-gradient(
						linear,
						left bottom,
						left top,
						color-stop(0, rgb(48,48,48)),
						color-stop(1, rgb(102, 102, 102))
				);
				text-shadow: 0px -1px 0px rgba(0,0,0,.5);
				font-size: 0.8em;
				border-radius: 0;
				min-width: 120px;
				cursor: pointer;
			}
		}

		& .track-sidebars {
			position: sticky;
			width: 120px;
			left: 0;
			z-index: 800;
		}

		& .timeline-relative {
			height: 100%;
			width: 100%;
			position: relative;

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
