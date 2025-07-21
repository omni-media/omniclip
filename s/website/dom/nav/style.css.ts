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
	background: rgba(15, 15, 15, 0.7);
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
	z-index: 1000;
	transition: background 0.3s ease;
}

nav .logo {
	height: 32px;
	width: 36px;
}

.menu-icon {
	width: 28px;
	height: 28px;
	cursor: pointer;
	display: none;
}

.menu {
	display: none;
	flex-direction: column;
	position: absolute;
	top: 100%;
	right: 1.5em;
	background: rgba(15, 15, 15, 0.9);
	backdrop-filter: blur(10px);
	padding: 1em;
	border-radius: 0.75rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.menu a {
	color: white;
	text-decoration: none;
	margin: 0.5em 0;
	font-size: 0.95rem;
	transition: color 0.2s ease;
}

.menu a:hover {
	color: var(--accent, #7f5cff);
}

.nav {
	display: flex;
	align-items: center;
	gap: 1.5em;
}

.nav a {
	color: white;
	text-decoration: none;
	font-size: 0.95rem;
	font-weight: 500;
	transition: color 0.2s ease;
}

.nav a:hover {
	color: var(--accent, #7f5cff);
}

nav a.try {
	background: white;
	color: black;
	padding: 0.5em 1.25em;
	border-radius: 7px;
	font-weight: 600;
	transition: background 0.2s ease, color 0.2s ease;
	display: flex;
	align-items: center;
	gap: 1em;
}

nav a.try:hover {
	background: #e1e1e1;
	color: black;
}

@media (max-width: 768px) {
	.menu-icon {
		display: block;
	}

	.nav {
		display: none;
	}

	.menu[data-opened="true"] {
		display: flex;
	}
}
`
