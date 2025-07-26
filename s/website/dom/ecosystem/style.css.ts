import {css} from "@benev/slate"

export default css`
.ecosystem {
	padding: 8rem 1rem;
	max-width: 1100px;
	margin: 0 auto;
	text-align: center;
	color: white;
}

.ecosystem h2 {
	font-weight: 700;
	margin-bottom: 0.5rem;
}

.ecosystem .subtitle {
	color: #aaa;
	font-size: var(--sl-font-size-medium);
	line-height: 1.6;
	margin-bottom: 3rem;
	max-width: 700px;
	margin-inline: auto;
}

.ecosystem .subtitle .credit {
	color: #666;
	font-style: italic;
	font-size: 0.9em;
}

.ecosystem .subtitle a {
	color: var(--accent, #7f5cff);
	text-decoration: underline;
	transition: color 0.2s ease;
}

.ecosystem .subtitle a:hover {
	color: white;
}

.libraries {
	display: flex;
	flex-direction: column;
	gap: 2em;

	& .group-title {
		display: flex;
		justify-content: center;
		gap: 0.5em;
		align-items: center;

		& img {
			width: 30px;
		}
	}
}

.ecosystem-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
}

.eco-item {
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.06);
	border-radius: 0.75rem;
	padding: 1.5rem;
	backdrop-filter: blur(8px);
	transition: border 0.3s ease, background 0.3s ease;
	text-align: left;
	overflow: hidden;
	cursor: pointer;

	& h3 {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	& .item-background {
		position: absolute;
  	top: 0;
  	left: 0;
  	width: 100%;
  	height: 100%;
  	object-fit: cover;
  	z-index: -1;
  	opacity: 0.2;
  	transition: all 0.5s ease;
	}

	& .item-icon {
		width: 22px;
		height: 22px;
		border-radius: 5px;
	}
}

.eco-item:hover {
	background: rgba(255, 255, 255, 0.06);
	border-color: rgba(255, 255, 255, 0.1);

	& .item-background {
		opacity: 0.3;
	}
}

a {
	text-decoration: none;
}

.eco-item h3 {
	font-size: var(--sl-font-size-large);
	margin-bottom: 0.5rem;
	color: white;
}

.eco-item p {
	font-size: var(--sl-font-size-small);
	color: #ccc;
	padding: 0.2em;
	border-radius: 5px;
	text-shadow: 0.1em 0.1em 0.1em #0008;
}
`
