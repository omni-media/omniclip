
export function getMetaVersion() {
	return document.head
		.querySelector("meta[data-version]")!
		.getAttribute("data-version")!
		.trim()
}

