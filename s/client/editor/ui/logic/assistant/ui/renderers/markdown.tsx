
import type {Element} from "hast"
import {remarkLinkify} from "remark-linkify"
import {
	MarkdownTextPrimitive,
	type MarkdownTextPrimitiveProps,
} from "@assistant-ui/react-markdown"

import {LinkPreview} from "../components/elements/link-preview.js"

function standaloneLinkPreview(node: Element | undefined) {
	if (!node) return

	const visibleChildren = node.children.filter(
		child => child.type !== "text" || child.value.trim(),
	)
	if (visibleChildren.length !== 1) return

	const [child] = visibleChildren
	if (child.type !== "element" || child.tagName !== "a") return

	const href = child.properties.href
	if (!href) return

	const lowerHref = href.toLowerCase()
	if (!lowerHref.startsWith("http://") && !lowerHref.startsWith("https://")) return

	return (
		<div className="assistant-ui-elements">
			<LinkPreview href={href} layout="compact" />
		</div>
	)
}

const components: MarkdownTextPrimitiveProps["components"] = {
	p: ({node, children, ...props}) =>
		standaloneLinkPreview(node) ?? <p {...props}>{children}</p>,
	li: ({node, children, ...props}) =>
		<li {...props}>{standaloneLinkPreview(node) ?? children}</li>,
}

export const AssistantMarkdown = () =>
	<MarkdownTextPrimitive
		className="message-markdown"
		components={components}
		remarkPlugins={[remarkLinkify]}
		smooth={false}
	/>

