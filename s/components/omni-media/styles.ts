import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
		--primary-color: #7c6cf0;
		--success-color: #34d399;
		--danger-color: #f04444;
		--surface-color: #0f0f14;
		--surface-hover: #16161e;
		--surface-active: #1e1e28;
		--border-color: #2a2a38;
		--text-primary: #f0f0f5;
		--text-secondary: #a0a0b4;
		--card-radius: 8px;
		--transition-speed: 0.2s;
	}

	.media-panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 10;
		padding: 12px;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.import-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: var(--primary-color);
		color: white;
		padding: 8px 16px;
		border-radius: 5px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color var(--transition-speed) ease;
		user-select: none;
	}

	.import-btn:hover {
		background-color: #9488f5;
	}

	.import-btn:active {
		background-color: #6358d4;
	}

	.import-icon svg {
		width: 18px;
		height: 18px;
	}

	.hide {
		display: none;
	}

	.media-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 8px;
		padding: 12px;
		overflow-y: auto;
	}

	.media-card {
		position: relative;
		border-radius: var(--card-radius);
		background-color: var(--surface-hover);
		border: 1px solid #1e1e28;
		transition: border-color var(--transition-speed) ease;
		display: flex;
		flex-direction: column;
	}

	.media-card:hover {
		border-color: var(--border-color);
	}

	.media-element {
		position: relative;
		background-color: var(--surface-color);
		overflow: hidden;
		aspect-ratio: 16/9;
	}

	.media-element img,
	.media-element video {
		width: 100%;
		height: 100%;
		object-fit: fill;
	}

	.audio-wave {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background: linear-gradient(135deg, #16161e 0%, #0f0f14 100%);
	}

	.audio-wave svg {
		width: 50%;
		height: 50%;
		color: var(--primary-color);
		opacity: 0.7;
	}

	.media-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%);
		opacity: 0;
		transition: opacity var(--transition-speed) ease;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 8px;
	}

	.media-card:hover .media-overlay {
		opacity: 1;
	}

	.media-type-badge {
		align-self: flex-start;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 0.7rem;
		padding: 2px 6px;
		border-radius: 4px;
		backdrop-filter: blur(4px);
	}

	.media-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
	}

	.action-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		border: none;
		cursor: pointer;
		transition: background-color var(--transition-speed) ease, transform var(--transition-speed) ease;
	}

	.action-btn svg {
		width: 16px;
		height: 16px;
	}

	.add-btn {
		color: var(--success-color);
	}

	.add-btn:hover {
		background-color: rgba(52, 211, 153, 0.2);
		transform: scale(1.1);
	}

	.delete-btn {
		color: var(--danger-color);
	}

	.delete-btn:hover {
		background-color: rgba(240, 68, 68, 0.2);
		transform: scale(1.1);
	}

	.media-info {
		padding: 10px;
		background-color: var(--surface-hover);
	}

	.media-name {
		display: block;
		font-size: 12px;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Placeholder styling */
	.placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 150px;
		background-color: var(--surface-hover);
	}

	.placeholder-animation {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		animation: pulse 1.5s infinite ease-in-out;
	}

	.placeholder-animation svg {
		width: 40px;
		height: 40px;
		opacity: 0.5;
		color: var(--primary-color);
	}

	@keyframes pulse {
		0% { opacity: 0.6; }
		50% { opacity: 1; }
		100% { opacity: 0.6; }
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 48px;
		text-align: center;
		color: var(--text-secondary);
		flex: 1;
	}

	.empty-icon {
		margin-bottom: 16px;
	}

	.empty-icon svg {
		width: 48px;
		height: 48px;
		opacity: 0.5;
	}

	.empty-text {
		font-size: 1.2rem;
		margin-bottom: 8px;
		color: var(--text-primary);
	}

	.empty-subtext {
		font-size: 0.9rem;
	}

	/* Drag and drop */
	.drag-message {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 20;
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--transition-speed) ease;
	}

	.drag-active .drag-message {
		opacity: 1;
		pointer-events: auto;
	}

	.drag-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32px;
		background-color: rgba(15, 15, 20, 0.8);
		border-radius: 12px;
		border: 2px dashed var(--primary-color);
	}

	.drag-icon svg {
		width: 48px;
		height: 48px;
		color: var(--primary-color);
		margin-bottom: 16px;
	}

	.drag-text {
		font-size: 1.2rem;
		color: white;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.media-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 8px;
			padding: 8px;
		}

		.header {
			padding: 8px;
		}

		.import-btn {
			padding: 8px;
		}
	}
`

