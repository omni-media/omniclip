
import {ev} from "@e280/stz"
import {Controller, Decoder, type Bindings, type Expression, type Input, type Source} from "@benev/tact"

function activeElement() {
	let element = document.activeElement
	while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement
	return element
}

export function isEditableElement() {
	return activeElement()?.matches('input, textarea, select, [contenteditable], wa-input, wa-textarea, wa-select, wa-number-input') ?? false
}

const isExpression = (value: Bindings): value is Expression =>
	value === null || typeof value !== "object" || Array.isArray(value)

// Prevent browser behavior immediately, even when the shortcut itself waits for a tap or hold.
function withoutTiming(value: Bindings): Bindings {
	if (Array.isArray(value)) {
		if (value[0] === "held") return withoutTiming(value[2])
		if (value[0] === "taps") return withoutTiming(value[3])
		return value.map(part => typeof part === "object" ? withoutTiming(part) : part) as Expression
	}
	if (isExpression(value)) return value
	return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, withoutTiming(child)]))
}

function usesCode(expression: Expression, code: string): boolean {
	return expression === code || Array.isArray(expression) && expression.slice(1).some(part => usesCode(part as Expression, code))
}

function handlesCode(bindings: Bindings, inputs: unknown, code: string): boolean {
	if (isExpression(bindings)) return (inputs as Input).value !== 0 && usesCode(bindings, code)
	return Object.entries(bindings).some(([key, child]) =>
		handlesCode(child, (inputs as Record<string, unknown>)[key], code),
	)
}

export function preventBrowserShortcuts(source: Source, getBindings: () => Bindings, disabled: () => boolean) {
	let current = getBindings()
	const controller = new Controller({source, bindings: withoutTiming(current)})
	const decoder = new Decoder(controller.bindings)

	const handle = (event: KeyboardEvent) => {
		if (current !== getBindings()) {
			current = getBindings()
			controller.bindings = withoutTiming(current)
		}
		const inputs = decoder.decode(controller.encode())
		if (!disabled() && handlesCode(controller.bindings, inputs, event.code)) event.preventDefault()
	}

	const stop = ev<"keydown" | "keyup">(window, {keydown: handle, keyup: handle})
	return () => {
		stop()
		controller.dispose()
	}
}

