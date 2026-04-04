import {css} from "lit"

export default css`
	.settings-modal {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		min-width: 27rem;
	}

	.video, .audio {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.field {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.preview {
		position: relative;
		padding: 1em;
		justify-content: center;
		background: #18193b;
	}

	.preview-label {
		position: absolute;
		top: 1em;
		left: 1em;
	}

	.preview, .preview-box {
		display: flex;
		flex-direction: column;
	}

	.preview-box {
		justify-content: center;
		align-items: center;
		gap: 0.5em;

		.res {
			display: flex;
			font-size: var(--font-size-xs);
			align-items: center;
			justify-content: center;
			background: #1b1d26;
			padding: 1em;
			border: 1px solid;
			box-sizing: border-box;
		}
	}

`
