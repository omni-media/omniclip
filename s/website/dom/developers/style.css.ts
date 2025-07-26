import {css} from "@benev/slate"

export default css`

.developers {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

h2 {
	font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

h3 {
	color: white;
}

.features {
	margin-top: 2em;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 8px 32px rgba(0, 0, 0, 0.6);
	border-radius: 10px;
}

li {
	margin-left: 2em;
}

h4 {
	padding: 1.5em 0;
	color: white;
}

.feature-header {
	padding: 1em;
	font-size: 1.5rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.feature-content {
	padding: 1.5em;
}

.feature-list {
	display: flex;
	flex-direction: column;
	gap: 1em;
	margin-bottom: 1.5em;
}

.code-preview {
	background: black;
	padding: 0 1em;
	border-radius: 10px;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 0.5em;
  align-self: start;
  padding: 0.75em 1.5em;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: background 0.2s;
  cursor: pointer;
}
`
