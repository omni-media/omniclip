import {css} from "@benev/slate"

export const styles = css`
:host {
	display: flex;
	align-items: center;
	justify-content: center;
	border-left: 1px solid var(--border-default, #2a2a38);
	border-right: 1px solid var(--border-default, #2a2a38);
	width: 50px;
}

/* General styles for modals */
.modal {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	max-width: 500px;
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

	& tbody {
		font-family: Poppins-ExtraLight;
	}
}

.open {
	display: flex;
	cursor: pointer;
	padding: 0 0.2em;
	border: 1px solid var(--border-default, #2a2a38);
	border-radius: 5px;
	height: 28px;
	align-items: center;
	background: transparent;
	color: var(--text-secondary, #a0a0b4);

	&:hover {
		background: var(--bg-elevated, #1e1e28);
		color: var(--text-primary, #f0f0f5);
	}
}

.modal {
	&[data-hidden] {
		display: none;
	}
}

.modal-content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.modal-content h2 {
	font-size: 1.5rem;
	margin: 0;
	color: var(--text-primary, #f0f0f5);
}

.modal-content table {
	table-layout: fixed;
	width: 100%;
	border-collapse: collapse;
}

.modal-content th,
.modal-content td {
	padding: 8px;
	text-align: left;
	font-size: 12px;
}

.modal-content th {
	color: var(--text-tertiary, #6b6b80);
}

.modal-content td {
	color: var(--text-primary, #f0f0f5);
}

.modal-content button {
	padding: 8px 12px;
	background-color: var(--accent, #7c6cf0);
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 0.85rem;
}

.modal-content button:hover {
	background-color: var(--accent-hover, #9488f5);
}

.modal-content button.change-shortcut {
	background-color: var(--color-success, #34d399);
}

.modal-content button.change-shortcut:hover {
	background-color: #2bc48a;
}

.modal-content #reset-defaults {
	background-color: var(--color-danger, #f04444);
}

.modal-content #reset-defaults:hover {
	background-color: #d93636;
}

/* Close button */
#close-modal {
	background-color: var(--text-tertiary, #6b6b80);
}

#close-modal:hover {
	background-color: #5a5a70;
}

/* Styles for the conflict warning modal */
#conflict-warning {
	width: 300px;
}

#conflict-warning p {
	font-size: 0.9rem;
	color: var(--text-primary, #f0f0f5);
	margin: 0 0 16px 0;
	text-align: center;
}

#conflict-warning button {
	margin: 0 8px;
	padding: 8px 12px;
}

.shortcut-display {
	display: flex;
	height: 25px;
	width: 100%;
	max-width: 150px;
	padding: 0.2em;
	border-radius: 2px;
	cursor: pointer;
	color: var(--accent, #7c6cf0);
	font-family: Nippo-Regular;

	&:hover {
		outline: 1px solid var(--border-default, #2a2a38);
	}
}

.shortcut-input {
	width: 100%;
	max-width: 150px;
	padding: 0.2em;
	height: 25px;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	color: var(--accent, #7c6cf0);
	background: transparent;
	font-family: Nippo-Regular;

	&:hover {
		cursor: default;
		outline: 1px solid var(--border-default, #2a2a38);
	}
}

.shortcut-input:focus {
	outline: none;
	border-color: var(--accent, #7c6cf0);
	box-shadow: 0 0 5px rgba(124, 108, 240, 0.5);
}
`
