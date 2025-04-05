import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
		--primary-color: #3a86ff;
		--success-color: #10b981;
		--danger-color: #ef4444;
		--surface-color: #1e1e1e;
		--surface-hover: #2a2a2a;
		--surface-active: #333333;
		--border-color: #333333;
		--text-primary: #ffffff;
		--text-secondary: #a0a0a0;
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
		padding: 16px;
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
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color var(--transition-speed) ease;
		user-select: none;
	}

	.import-btn:hover {
		background-color: #2a75e6;
	}

	.import-btn:active {
		background-color: #1c5dbd;
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
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		padding: 16px;
		overflow-y: auto;
	}

	.media-card {
		position: relative;
		border-radius: var(--card-radius);
		background-color: #252525;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
		display: flex;
		flex-direction: column;
	}

	.media-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.media-element {
		position: relative;
		background-color: #1a1a1a;
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
		background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
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
		background-color: rgba(0, 0, 0, 0.6);
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
		background-color: rgba(0, 0, 0, 0.6);
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
		background-color: rgba(16, 185, 129, 0.2);
		transform: scale(1.1);
	}

	.delete-btn {
		color: var(--danger-color);
	}

	.delete-btn:hover {
		background-color: rgba(239, 68, 68, 0.2);
		transform: scale(1.1);
	}

	.media-info {
		padding: 10px;
		background-color: #252525;
	}

	.media-name {
		display: block;
		font-size: 0.85rem;
		color: var(--text-primary);
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
		background-color: #252525;
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
		background-color: rgba(30, 30, 30, 0.8);
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
			gap: 12px;
			padding: 12px;
		}

		.header {
			padding: 12px;
		}

		.import-btn {
			padding: 8px;
		}
	}
`

