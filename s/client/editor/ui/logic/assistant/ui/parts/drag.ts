
import {useRef, type PointerEvent as ReactPointerEvent} from "react"

type Drag = {
	pointerId: number
	startX: number
	startY: number
	left: number
	top: number
	host: HTMLElement
}

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value))

export function usePanelDrag(disabled: boolean) {
	const dragRef = useRef<Drag | null>(null)

	const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
		if (disabled || event.button !== 0 || window.matchMedia("(max-width: 600px)").matches)
			return
		if (event.target instanceof Element && event.target.closest("button"))
			return

		const root = event.currentTarget.getRootNode()
		if (!(root instanceof ShadowRoot))
			return

		const host = root.host as HTMLElement
		const rect = host.getBoundingClientRect()
		dragRef.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			left: rect.left,
			top: rect.top,
			host,
		}
		event.currentTarget.setPointerCapture(event.pointerId)
	}

	const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current
		if (!drag || drag.pointerId !== event.pointerId)
			return

		const rect = drag.host.getBoundingClientRect()
		const left = clamp(
			drag.left + event.clientX - drag.startX,
			window.innerWidth - rect.width,
		)
		const top = clamp(
			drag.top + event.clientY - drag.startY,
			window.innerHeight - rect.height,
		)
		drag.host.style.left = `${left}px`
		drag.host.style.top = `${top}px`
		drag.host.style.right = "auto"
	}

	const stopDrag = (event: ReactPointerEvent<HTMLElement>) => {
		if (dragRef.current?.pointerId === event.pointerId)
			dragRef.current = null
	}

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp: stopDrag,
		onPointerCancel: stopDrag,
	}
}

