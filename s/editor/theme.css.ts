
import {css} from "lit"
export default css`@layer theme, view; @layer theme {

* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

:host {
	--bg: var(--omni-bg, black);
	--wa-color-focus: #777;
	--wa-color-surface-default: #181818;
	--wa-color-surface-raised: #1f1f1f;
	--wa-color-surface-lowered: #101010;
	--wa-color-surface-border: #303030;
	--wa-color-text-normal: #ddd;
	--wa-color-text-quiet: #8f8f8f;
	--wa-color-neutral-fill-loud: #3a3a3a;
	--wa-color-neutral-fill-normal: #303030;
	--wa-color-neutral-fill-quiet: #252525;
	--wa-color-neutral-border-loud: #555;
	--wa-color-neutral-border-normal: #3f3f3f;
	--wa-color-neutral-border-quiet: #303030;
	--wa-color-neutral-on-loud: #f0f0f0;
	--wa-color-neutral-on-normal: #e0e0e0;
	--wa-color-neutral-on-quiet: #cfcfcf;
	--wa-color-brand-fill-loud: #3a3a3a;
	--wa-color-brand-fill-normal: #2f2f2f;
	--wa-color-brand-fill-quiet: #262626;
	--wa-color-brand-border-loud: #5a5a5a;
	--wa-color-brand-border-normal: #444;
	--wa-color-brand-border-quiet: #333;
	--wa-color-brand-on-loud: #f0f0f0;
	--wa-color-brand-on-normal: #e0e0e0;
	--wa-color-brand-on-quiet: #d0d0d0;
	--wa-form-control-background-color: #232323;
	--wa-form-control-border-color: #333;
	--wa-form-control-border-radius: 3px;
	--wa-form-control-activated-color: #575757;
	--wa-form-control-value-color: #e0e0e0;
	--wa-form-control-placeholder-color: #8a8a8a;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 1em; }
::-webkit-scrollbar-thumb:hover { background: #444; }

a {
	color: var(--link);
	text-decoration: none;

	&:visited {
		color: color-mix(in srgb, purple, var(--link) 70%);
	}

	&:hover {
		color: color-mix(in srgb, white, var(--link) 90%);
		text-decoration: underline;
	}

	&:active {
		color: color-mix(in srgb, white, var(--link) 50%);
	}
}

[theme="topper"] {
	display: flex;
	align-items: center;
	height: 2em;
	width: 100%;
	background: #fff1;
	padding: 0.2em 0.5em 0.2em 3em;
}

[theme="paddy"] {
	flex: 1 1 0;
	overflow: auto;

	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;

	gap: 0.5em;
	padding: 1em;

	&::before, &::after {
		content: "";
		display: block;
		flex: 1 1 0;
	}
}

}`

