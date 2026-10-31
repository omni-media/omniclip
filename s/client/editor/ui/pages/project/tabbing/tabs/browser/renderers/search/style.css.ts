
import {css} from "lit"

export default css`@layer view {

.media-search {
	min-width: 0;
	padding-right: 3px;
}

.ai-search-toggle {
	display: grid;
	place-items: center;
	flex-shrink: 0;
	width: 26px;
	height: 26px;
	padding: 4px;
	border: 0;
	border-radius: 5px;
	background: transparent;
	color: #999;
	cursor: pointer;

	&:hover, &[data-active] {
		color: #c1a1ff;
	}

	&:focus-visible {
		outline: 2px solid #b58aff;
	}

	svg {
		width: 17px;
		height: 17px;
	}
}

.media-toolbar:has(> wa-popover:state(open)) .ai-search-toggle {
	background: #9871e818;
}

wa-popover {
	--max-width: min(340px, 90vw);

	&::part(body) {
		padding: 0;
		background: #161616;
		color: #ccc;
		border: 0;
		border-radius: 10px;
		box-shadow: 0 8px 24px #0005;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		text-shadow: none;
	}
}

.media-toolbar > wa-popover {
	display: contents;
}

.ai-search-status {
	box-sizing: border-box;
	width: min(310px, 80vw);
	padding: 16px;
	font-size: var(--font-size-xs);
	line-height: 1.5;

	p {
		margin: 8px 0 12px;
		color: #999;
		overflow-wrap: anywhere;

		&:last-child {
			margin-bottom: 0;
		}
	}

	[role="alert"] {
		color: #f2a5a5;
	}

	progress {
		display: block;
		width: 100%;
		height: 5px;
		margin: 7px 0;
		appearance: none;
		border: 0;
		border-radius: 3px;
		overflow: hidden;
		background: #383838;
		accent-color: #a27de5;

		&::-webkit-progress-bar {
			background: #383838;
			border-radius: 3px;
		}

		&::-webkit-progress-value {
			background: #a27de5;
			border-radius: 3px;
		}

		&::-moz-progress-bar {
			background: #a27de5;
			border-radius: 3px;
		}
	}
}

.ai-heading {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	color: #eee;
	font-size: 14px;
}

.ai-switch {
	width: 32px;
	height: 18px;
	padding: 2px;
	border: 0;
	border-radius: 12px;
	background: #484848;
	cursor: pointer;

	span {
		display: block;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #eee;
		transition: transform 0.15s;
	}

	&[aria-checked="true"] {
		background: #9670df;

		span {
			transform: translateX(14px);
		}
	}

	&:focus-visible {
		outline: 2px solid #b58aff;
		outline-offset: 2px;
	}
}

.ai-task {
	padding-top: 12px;
	border-top: 1px solid #222;
}

.ai-task-content {
	overflow-wrap: anywhere;

	strong {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #ddd;
		font-weight: 500;
	}
}

.ai-progress-row {
	display: flex;
	align-items: center;
	gap: 8px;

	progress {
		flex: 1;
		min-width: 0;
		width: auto;
		margin: 0;
	}

	&:has(progress, button) {
		margin: 6px 0;
	}
}

.ai-pause {
	display: grid;
	place-items: center;
	flex-shrink: 0;
	width: 22px;
	height: 22px;
	padding: 0;
	border: 0;
	border-radius: 50%;
	background: #444;
	color: #eee;
	cursor: pointer;

	svg {
		width: 12px;
		height: 12px;
	}

	&:hover {
		background: #555;
	}
}

.ai-queue-count {
	margin-bottom: 6px;
	color: #999;
}

.ai-loading {
	display: flex;
	flex-shrink: 0;

	svg {
		width: 14px;
		height: 14px;
	}
}

.ai-task-meta {
	color: #999;
	margin-top: 2px;
}

.ai-retry {
	padding: 6px 10px;
	border: 1px solid #444;
	border-radius: 6px;
	background: #292929;
	color: #eee;
	cursor: pointer;
}

}`

