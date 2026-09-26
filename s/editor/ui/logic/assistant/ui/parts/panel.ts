
import {useRef, useState} from "react"
import {usePanelDrag} from "./drag.js"

export function useChatPanel(onClose: () => void) {
	const [minimized, setMinimized] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)
	const panelRef = useRef<HTMLElement>(null)
	const dragHandlers = usePanelDrag(fullscreen)

	const host = () => {
		const root = panelRef.current?.getRootNode()
		return root instanceof ShadowRoot ? root.host as HTMLElement : null
	}

	const setPanelMinimized = (value: boolean) => {
		setMinimized(value)
		host()?.toggleAttribute("data-minimized", value)
	}

	const setPanelFullscreen = (value: boolean) => {
		const element = host()
		const from = element?.getBoundingClientRect()

		setFullscreen(value)
		element?.toggleAttribute("data-fullscreen", value)

		if (!element || !from || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
			return

		requestAnimationFrame(() => {
			const to = element.getBoundingClientRect()
			if (!to.width || !to.height)
				return
			const x = from.left - to.left
			const y = from.top - to.top
			const scaleX = from.width / to.width
			const scaleY = from.height / to.height
			element.animate([
				{
					transformOrigin: "top left",
					transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`,
				},
				{transformOrigin: "top left", transform: "none"},
			], {duration: 220, easing: "cubic-bezier(.2, .8, .2, 1)"})
		})
	}

	const close = () => {
		setPanelMinimized(false)
		setPanelFullscreen(false)
		onClose()
	}

	return {
		panelRef,
		minimized,
		fullscreen,
		dragHandlers,
		setPanelMinimized,
		setPanelFullscreen,
		close,
	}
}

