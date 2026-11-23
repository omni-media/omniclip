
export function parseWebLink(href: string) {
	try {
		const url = new URL(href)
		if (url.protocol !== "http:" && url.protocol !== "https:") return
		return {href: url.href, host: url.hostname.replace(/^www\./, "")}
	}
	catch {
		return undefined
	}
}

