
import {css} from "lit"

export default css`
.loading-panels {
	position: fixed;
	inset: 36px 0 0;
	display: grid;
	background: #101010;
}

.loading-panel {
	display: none;
	position: relative;
	flex-direction: column;
	gap: 0.75rem;
	padding: 0.75rem;
	overflow: hidden;
	background: #151515;
}

.loading-panel wa-skeleton {
	--color: #222;
	--sheen-color: #303030;
}

.loading-panel wa-skeleton::part(indicator) {
	border-radius: 3px;
}

.loading-viewport {
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-title {
	width: 5rem;
	height: 0.65rem;
}

.loading-toolbar {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 2rem 2rem;
	gap: 0.4rem;
}

.loading-toolbar wa-skeleton {
	height: 2rem;
}

.loading-media-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.85rem 0.65rem;
}

.loading-media-card {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.loading-thumbnail {
	height: auto;
	aspect-ratio: 16 / 9;
}

.loading-label {
	width: 78%;
	height: 0.65rem;
}

.loading-viewer {
	width: min(76%, 60rem);
	height: auto;
	aspect-ratio: 16 / 9;
}

.loading-rows,
.loading-fields {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
}

.loading-row {
	height: 0.75rem;
}

.loading-row:nth-child(3n + 1) { width: 88%; }
.loading-row:nth-child(3n + 2) { width: 72%; }
.loading-row:nth-child(3n) { width: 80%; }

.loading-field {
	display: grid;
	grid-template-columns: 35% minmax(0, 1fr);
	gap: 0.65rem;
}

.loading-field wa-skeleton {
	height: 1.4rem;
}

.loading-ruler {
	height: 0.65rem;
}

.loading-tracks {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}

.loading-track {
	height: 1.65rem;
}

.loading-track:nth-child(1) { width: 92%; }
.loading-track:nth-child(2) { width: 74%; margin-left: 8%; }
.loading-track:nth-child(3) { width: 84%; margin-left: 3%; }
.loading-track:nth-child(4) { width: 62%; margin-left: 18%; }

.loading-meters {
	display: flex;
	flex: 1;
	align-items: end;
	justify-content: center;
	gap: 1.25rem;
}

.loading-meter {
	width: 0.75rem;
	height: 70%;
}

.loading-meter:nth-child(2) { height: 52%; }
.loading-meter:nth-child(3) { height: 82%; }

@media (min-width: 1024px) {
	.loading-panels {
		grid-template-areas:
			"browser viewport inspector"
			"outliner timeline audio";
		grid-template-columns: 300px minmax(0, 1fr) 300px;
		grid-template-rows: minmax(0, 55fr) minmax(0, 45fr);
		gap: 1px;
	}

	.loading-panel { display: flex; }
	.loading-browser { grid-area: browser; }
	.loading-outliner { grid-area: outliner; }
	.loading-viewport { grid-area: viewport; }
	.loading-timeline { grid-area: timeline; }
	.loading-inspector { grid-area: inspector; }
	.loading-audio { grid-area: audio; }
}
`

