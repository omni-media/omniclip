
import {Atom, Modifiers} from "@benev/tact"
import {
	ShortcutCommand,
	ShortcutGroupId,
	unassignedBinding,
} from "../../../../context/controllers/input/meta.js"

export type TabId = "all" | ShortcutGroupId
export type ShortcutCombo = {atom: Atom, keys: string[], signature: string}

export function shortcutFromEvent(event: KeyboardEvent): ShortcutCombo | null {
	if (["Control", "Shift", "Alt", "Meta"].includes(event.key))
		return null

	const keys = [
		...(event.ctrlKey ? ["Ctrl"] : []),
		...(event.shiftKey ? ["Shift"] : []),
		...(event.altKey ? ["Alt"] : []),
		...(event.metaKey ? ["Cmd"] : []),
		formatCode(event.code),
	]
	const modifiers: Partial<Modifiers> = {
		ctrl: event.ctrlKey,
		shift: event.shiftKey,
		alt: event.altKey,
		meta: event.metaKey,
	}
	const atom: Atom = hasModifiers(modifiers)
		? ["mods", event.code, modifiers]
		: event.code

	return {atom, keys, signature: comboSignature(keys)}
}

function hasModifiers(modifiers: Partial<Modifiers>) {
	return !!(modifiers.ctrl || modifiers.shift || modifiers.alt || modifiers.meta)
}

export function combosFromAtom(atom: Atom): ShortcutCombo[] {
	if (atom === unassignedBinding)
		return []

	if (typeof atom === "string")
		return [combo(atom, [formatCode(atom)])]

	switch (atom[0]) {
		case "or":
			return atom.slice(1).flatMap(combosFromAtom)

		case "code": {
			const [, code, settings] = atom
			const key = settings?.timing?.[0] === "hold"
				? `Hold ${formatCode(code)}`
				: formatCode(code)
			return [combo(atom, [key])]
		}

		case "mods": {
			const [, subject, modifiers] = atom
			return combosFromAtom(subject).map(entry => {
				const keys = [
					...(modifiers.ctrl ? ["Ctrl"] : []),
					...(modifiers.shift ? ["Shift"] : []),
					...(modifiers.alt ? ["Alt"] : []),
					...(modifiers.meta ? ["Cmd"] : []),
					...entry.keys,
				]
				return combo(atom, keys)
			})
		}

		default:
			return [combo(atom, [atom[0]])]
	}
}

function combo(atom: Atom, keys: string[]): ShortcutCombo {
	return {atom, keys, signature: comboSignature(keys)}
}

function comboSignature(keys: string[]) {
	return keys.map(key => key.toLowerCase()).sort().join("+")
}

export function atomSignature(atom: Atom) {
	return JSON.stringify(combosFromAtom(atom).map(combo => combo.signature).sort())
}

export function atomHasSignature(atom: Atom, signature: string) {
	return combosFromAtom(atom).some(combo => combo.signature === signature)
}

export function commandMatches(command: ShortcutCommand, atom: Atom, query: string) {
	const text = query.trim().toLowerCase()
	if (!text)
		return true

	const bindingText = combosFromAtom(atom)
		.flatMap(combo => combo.keys)
		.join(" ")
		.toLowerCase()

	return command.name.toLowerCase().includes(text)
		|| command.description?.toLowerCase().includes(text)
		|| bindingText.includes(text)
}

function formatCode(code: string) {
	const map: Record<string, string> = {
		Space: "Space",
		ArrowLeft: "Left",
		ArrowRight: "Right",
		ArrowUp: "Up",
		ArrowDown: "Down",
		Backspace: "Backspace",
		Delete: "Delete",
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
