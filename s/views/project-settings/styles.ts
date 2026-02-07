import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		flex-direction: column;
		align-items: start;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}

	.settings {
		display: flex;
		gap: 12px;
		flex-direction: column;
		padding: 12px;

		& .bitrate {
			background: var(--bg-surface, #16161e);
			border: 1px solid var(--border-default, #2a2a38);
			border-radius: 5px;
			padding: 0.2em;
			color: var(--text-secondary, #a0a0b4);
			font-family: Nippo-Regular;
		}

		& .timebases {
			display: flex;
			gap: 0.5em;
			flex-wrap: wrap;

			& .timebase {
				border: 1px solid var(--border-default, #2a2a38);
				border-radius: 5px;
				padding: 4px 8px;
				cursor: pointer;
				font-size: 0.9em;

				&[data-selected] {
					border-color: var(--accent, #7c6cf0);
					background: var(--accent-muted, rgba(124, 108, 240, 0.15));
					color: var(--text-primary, #f0f0f5);
				}
			}
		}

		& .resolutions {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5em;

			& p {
				border: 1px solid var(--border-default, #2a2a38);
				padding: 4px 12px;
				border-radius: 5px;
				font-size: 0.9em;

				&[data-selected] {
					color: var(--text-primary, #f0f0f5);
					border-color: var(--accent, #7c6cf0);
					background: var(--accent-muted, rgba(124, 108, 240, 0.15));
				}
			}
		}

		& .aspect-ratios {
			display: flex;
			gap: 1em;
			flex-wrap: wrap;

			& .cnt {
				display: flex;
				align-self: end;
				max-width: 100px;
				width: 100%;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				text-align: center;
				gap: 0.3em;
				color: gray;
				cursor: pointer;

				& .aspect-ratio {
					font-size: 0.9em;
				}

				& .info {
					font-size: 0.8em;
				}

				&[data-selected] {
					color: var(--text-primary, #f0f0f5);
				}

				& .shape {
					height: 50px;
					border-radius: 5px;
					border: 1px solid;
					margin-bottom: 0.5em;
				}
			}
		}

		& select {
			cursor: pointer;
		}

		& .error {
			color: var(--color-danger, #f04444);
			font-size: 11px;
		}
	}

	h2 {
		margin-bottom: 0.5em;
	}

	h4 {
		padding-bottom: 0.5em;
	}

	p {
		cursor: pointer;
		transition: all 0.3s ease;
	}
`
