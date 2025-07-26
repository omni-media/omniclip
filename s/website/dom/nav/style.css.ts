import {css} from "@benev/slate"

export default css`
nav {
	position: fixed;
	top: 1.5em;
	left: 50%;
	transform: translateX(-50%);
	width: 90%;
	max-width: 1200px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75em 1.25em;
	border-radius: 1rem;
	background: black;
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
	z-index: 1000;
	transition: background 0.3s ease;
	color: white;
	font-size: var(--sl-font-size-small);
	font-weight: var(--sl-font-weight-semibold);
}

.left {
	width: 10em;
}

.logo {
	height: 32px;
	width: 36px;
}

.menu-icon {
	width: 28px;
	height: 28px;
	cursor: pointer;
	display: none;
}

.desktop-only {
	display: flex;
	gap: 2.5em;
}

.desktop-only a {
	text-decoration: none;
	color: white;
	transition: color 0.2s ease;
}

.desktop-only a:hover {
	color: var(--accent, #7f5cff);
}

.try {
	background: white;
	color: black;
	padding: 0.5em 1.25em;
	border-radius: 7px;
	display: flex;
	align-items: center;
	gap: 1em;
	font-weight: var(--sl-font-weight-bold);
	transition: background 0.2s ease, color 0.2s ease;
}

.try:hover {
	background: #e1e1e1;
	color: black;
}

.mobile-menu {
	display: none;
	flex-direction: column;
	position: absolute;
	top: calc(100% + 0.5em);
	right: 1.5em;
	background: rgba(15, 15, 15, 0.9);
	backdrop-filter: blur(10px);
	padding: 1em;
	border-radius: 0.75rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	z-index: 999;
}

.mobile-menu a {
	color: white;
	text-decoration: none;
	margin: 0.5em 0;
	transition: color 0.2s ease;
	font-size: var(--sl-font-size-small);
}

.mobile-menu a:hover {
	color: var(--accent, #7f5cff);
}

@media (max-width: 768px) {
	.desktop-only {
		display: none;
	}
	.right .try {
		display: none;
	}
	.menu-icon {
		display: block;
	}
	.mobile-only {
		display: block;
	}
	.mobile-menu[data-opened="true"] {
		display: flex;
	}
}
`

