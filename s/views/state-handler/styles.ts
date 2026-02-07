import {css} from "@benev/slate"

export const styles = css`

.box {
	margin: 1em;
}

ul {
	margin-left: 1em
}

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
}

.container {
	font-size: 15px;
	padding: 1rem 3rem;
	color: var(--text-primary, #f0f0f5);
}

.container {
	text-decoration: none;
	position: relative;
	overflow: hidden;
}

.container:before {
	content: "";
	position: absolute;
	background: linear-gradient(
		120deg,
		transparent,
		#1e1e28,
		transparent
	);
	animation-name: example;
	animation-duration: 2s;
	animation-iteration-count: infinite;
}

.container:hover:before {
	left: 100%;
}

@keyframes example {
	from {
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
	}
	to {
		left: 200%;
	}
}
`

