import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		overflow: scroll;
		position: relative;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		
		& .timeline-relative {
			position: relative;

			& * {
				will-change: transform;
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
