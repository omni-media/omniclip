import {css} from "@benev/slate"

export const styles = css`

	.live {
		display: flex;
		gap: 0.3em;
		border: 1px solid var(--border-default, #2a2a38);
		border-radius: 5px;
		font-family: Nippo-Regular;
		background: var(--bg-elevated, #1e1e28);
		color: var(--text-primary, #f0f0f5);
	}

	.settings, .exit {
		background: var(--bg-surface, #16161e);
		color: var(--text-primary, #f0f0f5);
		display: flex;
		outline: 1px solid var(--border-default, #2a2a38);
		border-radius: 3px;
		padding: 0 0.2em;
		cursor: pointer;

		& svg {
			width: 14px;
		}
	}

	.host-title {
		display: flex;
		align-items: center;
		gap: 0.4em;
		font-size: 1em;

		& .host {
			display: flex;
			gap: 0.2em;
			background: var(--bg-overlay, #262632);
			color: var(--text-primary, #f0f0f5);
			padding: 0 0.4em;
			font-size: 0.8em;
			border-radius: 5px;

			& svg {
				width: 16px;
			}
		}
	}

	.kind {
		display: flex;
		gap: 0.2em;
		background: var(--bg-overlay, #262632);
		color: var(--text-primary, #f0f0f5);
		padding: 0 0.4em;
		font-size: 0.8em;
		align-items: center;

		& svg {
			width: 16px;
		}
	}

	.peers {
		& h4 {
			margin-bottom: 0.3em;
		}

		& .peer {
			display: flex;
			align-items: center;
			gap: 0.2em;

			& span {
				display: flex;
				align-items: center;
				gap: 0.2em;
				border-radius: 3px;
				color: var(--text-tertiary, #6b6b80);
				margin-right: 0.4em;
			}
		}

		& .kick {
			background: var(--text-tertiary, #6b6b80);
			color: white;
			padding: 0 0.2em;
		}

		& .ban {
			background: var(--color-danger, #f04444);
			color: white;
			padding: 0 0.2em;
		}
	}

	.close {
		& button {
			background: var(--color-danger, #f04444);
			color: white;
			padding: 0 0.2em;
		}
	}

	.lock {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 25px;
		height: 14px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--bg-elevated, #1e1e28);
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 10px;
		width: 10px;
		left: 2px;
		bottom: 2px;
		background-color: white;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: var(--accent, #7c6cf0);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px var(--accent, #7c6cf0);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(10px);
		-ms-transform: translateX(10px);
		transform: translateX(10px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}

	.people {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.3em;
		color: var(--text-primary, #f0f0f5);
		padding: 0 0.4em;
		font-size: 0.8em;
		outline: 1px solid var(--border-default, #2a2a38);
		border-radius: 3px;
		background: var(--bg-surface, #16161e);
	}

	@keyframes opacity-animation {
		0% {
			opacity: 0
		}
	}

	@keyframes pulse-animation {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: .8
		}
		70% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(3)
		}
		to {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0
		}
	}

	.pulse:before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		background: #02ff02;
		border-radius: 100%;
		opacity: .5;
		transform: translate(-50%,-50%) scale(3);
		animation: pulse-animation 3s infinite;
	}

	.pulse {
		position: absolute;
		top: -4px;
		right: -5px;
		display: inline-block;
		vertical-align: 1px;
		width: 8px;
		height: 8px;
		color: transparent;
		border-radius: 100%;
		flex: 0 0 auto;
		animation: opacity-animation 1s linear;

		&.red {
			background: var(--color-danger, #f04444);
		}
		&.orange {
			background: var(--color-warning, #fbbf24);
		}
		&.green {
			background: var(--color-success, #34d399);
		}
		&.gray {
			background: gray;
			&:before {
				animation: none;
				background: none;
			}
		}
	}

	.collaborate {
		font-family: Poppins-Regular;
		display: flex;
		color: white;
		height: 28px;
		font-size: 0.8em;
		align-items: center;
		gap: 0.5em;
		cursor: pointer;
		border-radius: 5px;
		padding: 0 0.3em;

		background:
		linear-gradient(
			58.2deg,
			var(--accent, #7c6cf0) -3%,
			#9b59b6 97.7%
		);

		background-repeat: no-repeat;
		background-size: 110% 120%;
		background-position: center center;
	}

	.people {
		display: flex;
		align-items: center;
		gap: 0.3em;
	}

	.modal {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 400px;
		width: 100%;
		background: var(--bg-raised, #0f0f14);
		border: 1px solid var(--border-default, #2a2a38);
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		padding: 20px;
		z-index: 1000;
		font-family: Poppins-Regular;
		overflow-y: scroll;
		max-height: 100%;
		gap: 1em;

		& .title {
			display: flex;
			align-items: center;
			gap: 0.5em;
		}

		& .creating {
			display: flex;
			align-items: center;
			gap: 0.5em;
		}

		& .flex {
			display: flex;
			justify-content: space-between;
		}

		& button {
			cursor: pointer;
		}

		& .close-modal {
			align-self: end;
		}

		& .join {
			background: var(--accent, #7c6cf0);
			color: white;
			border: none;
			border-radius: 5px;
			font-size: 0.7em;
			padding: 0 0.4em;
			height: 20px;

			&:disabled {
				opacity: 0.4;
				cursor: default;
			}
		}

		& .start {
			background: var(--accent, #7c6cf0);
			color: white;
			border: none;
			border-radius: 5px;
			font-size: 0.8em;
			padding: 0 0.2em;
		}

		& .code-input {
			background: var(--bg-surface, #16161e);
			border: 1px solid var(--border-default, #2a2a38);
			height: 20px;
			padding: 0 0.2em;
			color: var(--text-primary, #f0f0f5);
			border-radius: 5px;
		}

		& .error {
			display: flex;
			align-items: center;
			gap: 0.5em;
		}

		& .reason {
			display: flex;
			flex-direction: column;

			& span {
				font-size: 0.8em;
				color: var(--color-danger, #f04444);
			}
		}

		& .renew {
			align-self: start;
			padding: 0 0.4em;
			font-size: 0.8em;
			color: white;
			background: var(--accent, #7c6cf0);
			border: none;
			border-radius: 5px;
		}

		&[data-hidden] {
			display: none;
		}
	}
`
