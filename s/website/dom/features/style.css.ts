import {css} from "@benev/slate"

export default css`
.features {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	padding-block:8rem;
	background:var(--bg-grad-1);
	text-align:center;
}

h2 {
	color: white;
}

.feature-grid {
	display: flex;
	width: 700px;
	flex-wrap: wrap;
	gap:2.5rem;
	margin-top:4rem;
	list-style:none;
	padding:0;
	justify-content: center;
	justify-self: center;
}

h3 {
	color: white;
}

video {
	width: 250px;
	border-radius: 10px;
}

.feature-card {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
	width: 350px;
	padding:2.25rem 2rem;
	border-radius:1.5rem;
  background:rgba(255,255,255,.04);
  backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 0 0 1px rgba(255,255,255,.08),0 8px 32px rgba(0,0,0,.6);

	p {
		font-size: 0.9rem;
	}
}

.animations, .filters {
	flex: 45%;
}

.fonts, .export, .files {
	flex: 30%;
}

.transitions {
	flex: 100%;
	flex-direction: row;

	.box {
		display: flex;
		flex-direction: column;
		gap: 1em;

		h3 {
			padding-bottom: 0.2em;
		}
	}
}
`
