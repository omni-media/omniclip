import {CSSResult, SVGTemplateResult, TemplateResult, html, css} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../context/context.js"

import type {
	computePosition as ComputePosition,
	autoUpdate as AutoUpdate,
	hide as Hide,
	autoPlacement as AutoPlacement
} from "@floating-ui/dom"
import {
	computePosition as untypedComputePosition,
	autoUpdate as untypedAutoUpdate,
	hide as untypedHide,
	autoPlacement as untypedAutoPlacement,
	arrow
	//@ts-ignore
} from "@floating-ui/dom/dist/floating-ui.dom.browser.mjs"

type Stuff = {
	button: HTMLButtonElement
	tooltip: HTMLElement
	cleanup: () => void
}

const autoPlacement = untypedAutoPlacement as typeof AutoPlacement
const computePosition = untypedComputePosition as typeof ComputePosition
const autoUpdate = untypedAutoUpdate as typeof AutoUpdate
const hide = untypedHide as typeof Hide

export const Tooltip = shadow_view(use => (icon: SVGTemplateResult, content: TemplateResult, hostStyles?: CSSResult) => {
	use.styles([styles, hostStyles ?? css``])
	const elements = use.signal<Stuff | null>(null)

	use.defer(() => {
		if (elements.value)
				return undefined
		const button = use.shadow.querySelector('#button') as HTMLButtonElement
		const tooltip = use.shadow.querySelector('#tooltip') as HTMLElement

		elements.value = {
			button,
			tooltip,
			cleanup: autoUpdate(button, tooltip, () => {
				computePosition(button, tooltip, {
						middleware: [hide()],
						strategy: "fixed",
						placement: 'top',
				}).then(({x, y}) => {
					Object.assign(tooltip.style, {
						left: `${x}px`,
						top: `${y}px`,
					})
				})
			})
		}
	})

	use.mount(() => () => {
		if (elements.value)
			elements.value.cleanup()
	})

	const showTooltip = () => {
		if(elements.value) {
			elements.value.tooltip.style.display = "flex"
		}
	}

	const hideTooltip = () => {
		if(elements.value) {
			elements.value.tooltip.style.display = "none"
		}
	}

	return html`
		<button
			@pointerenter=${showTooltip}
			@pointerleave=${hideTooltip}
			id="button"
		>
			${icon}
		</button>
		<div id="tooltip">
			${content}
			<i></i>
		</div>
	`
})
