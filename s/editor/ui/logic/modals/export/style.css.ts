
import {css} from "lit"

export default css`
	.grid {
		display: grid;
		grid-template-columns: 7em minmax(0, 1fr);
		gap: 0.55em 0.75em;
		align-items: center;
		padding: 0.35em 0;
	}

	.label {
		color: #9a9a9a;
		font-size: var(--font-size-xs);
	}

	.value {
		color: #ddd;
		font-size: var(--font-size-xs);
	}

	.custom {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;

		&::part(label) {
			color: #9a9a9a;
			margin: 0;
		}
	}

	.export {
		justify-content: space-between;

		.info {
			display: flex;
			align-items: center;
			color: #aaa;
		}

		.spacer {
			display: inline-block;
			height: 15px;
			width: 1px;
			background: #383838;
			margin: 0.4em;
		}
	}

	.export > div:last-child {
		display: flex;
		gap: 0.5em;
	}

	.export-progress {
		min-width: 20em;
		display: grid;
		gap: 1em;
	}

	.export-progress-canvas-wrapper {
		width: 100%;
		max-width: 24em;
		aspect-ratio: 16 / 9;
		background: #111;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #282828;
		pointer-events: none;

		& canvas {
			width: 100%;
			height: 100%;
			object-fit: contain;
			pointer-events: none;
		}
	}

	.export-progress-status {
		display: flex;
		align-items: center;
		gap: 0.6em;
		font-weight: 600;
	}

	.export-progress-status[data-error="true"] {
		color: #e57373;
	}

	.export-progress-icon {
		width: 1.4em;
		text-align: center;
		color: #69a7ff;
	}

	.export-progress p {
		margin: 0;
		color: #aaa;
		font-size: var(--font-size-xs);
	}

	.export-progress-track {
		height: 0.35em;
		overflow: hidden;
		border-radius: 999px;
		background: #282828;
	}

	.export-progress-fill {
		height: 100%;
		border-radius: 999px;
		background: #69a7ff;
		transition: width 0.1s linear;
	}

	.export-progress-close {
		justify-self: end;
	}
`
