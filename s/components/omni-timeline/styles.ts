import {css} from "@benev/slate"

export const styles = css`
	.timeline {
		display: flex;
		flex-direction: column;

		& .track {
			background: #0a0a0a;
			display: flex;
			height: 40px;
			outline: 1px solid gray;
		}

		& .drop-indicator {
			height: 40px;
			outline: green dotted 2px;
			position: absolute;
			background: #0080002e;
			border-radius: 5px;
			top: 0;
		}

		& .indicators {
			width: 100%;
			position: relative;
		}

		& .indicator-area {
			position: absolute;
			width: 100%;
			height: 14px;
			top: -7px;
			z-index: 2;
		}

		& .indicator {
			display: none;
			z-index: 1;
			position: relative;
			align-items: center;
			width: 100%;
			outline: 1px solid green;

			&[data-indicate] {
				display: flex;

				& .plus {
					color: #028100;
					left: 50vw;
					position: absolute;
					background: #1c1c1c;
					width: 20px;
					border-radius: 15px;
					display: flex;
					justify-content: center;
				}

				background: #0080002e;
			}

		}

		& .clip {
				display: flex;
				z-index: 1;
				align-items: center;
				justify-content: center;
				padding: 0.5em;
				background: #201f1f;
				border-radius: 5px;
				outline: 1px solid gray;
				cursor: pointer;
				position: absolute;
				top: 0;
				height: 40px;
		}
	}
`
