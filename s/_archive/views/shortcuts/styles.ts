import {css} from "@benev/slate"

export const styles = css`
:host {
	display: flex;
	align-items: center;
	justify-content: center;
	border-left: 1px solid gray;
	border-right: 1px solid gray;
	width: 50px;
}

/* General styles for modals */
.modal {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	max-width: 400px;
	width: 100%;
	background: #111;
	border: 1px solid #333;
	border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
	border: 1px solid gray;
	border-radius: 5px;
	height: 21px;
	align-items: center;
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
	color: white;
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
}

.modal-content th {
	font-size: 0.9rem;
	color: #666;
}

.modal-content td {
	font-size: 0.85rem;
	color: white;
}

.modal-content button {
	padding: 8px 12px;
	background-color: #007bff;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.85rem;
}

.modal-content button:hover {
	background-color: #0056b3;
}

.modal-content button.change-shortcut {
	background-color: #28a745;
}

.modal-content button.change-shortcut:hover {
	background-color: #218838;
}

.modal-content #reset-defaults {
	background-color: #dc3545;
}

.modal-content #reset-defaults:hover {
	background-color: #c82333;
}

/* Close button */
#close-modal {
	background-color: #6c757d;
}

#close-modal:hover {
	background-color: #5a6268;
}

/* Styles for the conflict warning modal */
#conflict-warning {
	width: 300px;
}

#conflict-warning p {
	font-size: 0.9rem;
	color: white;
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
	color: #007bff;

	&:hover {
		outline: 1px solid #333;
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
	color: #007bff;
	background: transparent;

	&:hover {
		cursor: default;
		outline: 1px solid #333;
	}
}

.shortcut-input:focus {
	outline: none;
	border-color: #007bff;
	box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
`
