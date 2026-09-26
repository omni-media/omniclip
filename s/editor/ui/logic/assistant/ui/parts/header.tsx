
import {Maximize2Icon, Minimize2Icon} from "lucide-react"
import type {useChatPanel} from "./panel.js"

export function ChatHeader({
	panel,
}: {
	panel: ReturnType<typeof useChatPanel>
}) {
	const {
		fullscreen,
		minimized,
		dragHandlers,
		setPanelMinimized,
		setPanelFullscreen,
		close,
	} = panel

	return <header
		title={fullscreen ? undefined : "Drag to move"}
		{...dragHandlers}>
		<strong><span>✦</span> Omniclip AI</strong>
		<div>
			{fullscreen
				? <button
					type="button"
					title="Exit full screen"
					aria-label="Exit full screen"
					onClick={() => setPanelFullscreen(false)}>
					<Minimize2Icon size={16} />
				</button>
				: <button
					type="button"
					title="Open full screen"
					aria-label="Open full screen"
					onClick={() => {
						setPanelMinimized(false)
						setPanelFullscreen(true)
					}}>
					<Maximize2Icon size={16} />
				</button>}

			{!fullscreen && <button
				type="button"
				title={minimized ? "Restore" : "Minimize"}
				onClick={() => setPanelMinimized(!minimized)}>
				{minimized ? "+" : "−"}
			</button>}
			<button type="button" title="Close" onClick={close}>×</button>
		</div>
	</header>
}

