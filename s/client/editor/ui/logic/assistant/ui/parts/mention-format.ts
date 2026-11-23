
import {defaultDirectiveFormatter, type DirectiveFormatter} from "@assistant-ui/react"

const {serialize, parse} = defaultDirectiveFormatter
const labelDelimiters = /[%\]\r\n]/g

export const mentionFormatter: DirectiveFormatter = {
	serialize: item => serialize({
		...item,
		label: item.label.replace(labelDelimiters, encodeURIComponent),
	}),
	parse: text => parse(text).map(part => {
		if (part.kind !== "mention") return part
		if (part.type !== "media" && part.type !== "timeline") return part

		return {...part, label: part.label.replace(/%(?:25|5D|0D|0A)/g, decodeURIComponent)}
	}),
}

