
import type {Expression} from "@benev/tact"

export function formatShortcut(expression: Expression): string {
	if (expression === null) return "Unassigned"
	if (typeof expression === "string") return formatCode(expression)
	if (typeof expression === "number") return String(expression)
	const [operator, ...parts] = expression
	if (operator === "mod") {
		const labels = {ctrl: "Ctrl", meta: "Cmd", alt: "Alt", shift: "Shift"}
		return expression.slice(1).map(mod => labels[mod as keyof typeof labels]).join("+")
	}
	if (operator === "held") return `Hold ${formatShortcut(expression[2])}`
	if (operator === "taps") return formatShortcut(expression[3])
	const labels = parts.map(part => formatShortcut(part as Expression)).filter(Boolean)
	return labels.join(operator === "max" ? " / " : "+")
}

function formatCode(code: string) {
	const map: Record<string, string> = {
		ArrowLeft: "Left",
		ArrowRight: "Right",
		ArrowUp: "Up",
		ArrowDown: "Down",
		Escape: "Esc",
		Equal: "=",
		Minus: "-",
		Slash: "/",
		Comma: ",",
		Period: ".",
		Semicolon: ";",
		Quote: "'",
		BracketLeft: "[",
		BracketRight: "]",
		Backslash: "\\",
		Backquote: "`",
		NumpadAdd: "Num +",
		NumpadSubtract: "Num -",
	}

	if (map[code])
		return map[code]

	if (/^Key[A-Z]$/.test(code))
		return code.slice(3)

	if (/^Digit[0-9]$/.test(code))
		return code.slice(5)

	return code
}
