
import {Cellar} from "@e280/quay"

import {assistantModelId} from "../../models/builtins.js"

export async function cacheModel(
	url: string,
	onProgress: (loaded: number, total: number) => void,
) {
	await navigator.storage.persist()

	const cellar = await Cellar.opfs(assistantModelId)
	const cached = await getCachedModel(cellar)

	if (cached)
		return cached

	const stream = await downloadModel(url, onProgress)
	const hash = await cellar.write(stream)

	return (await cellar.load(hash)).file.stream()
}

async function getCachedModel(cellar: Cellar) {
	for await (const hash of cellar.list())
		return (await cellar.load(hash)).file.stream()
}

async function downloadModel(
	url: string,
	onProgress: (loaded: number, total: number) => void,
) {
	const response = await fetch(url)

	if (!response.ok || !response.body)
		throw new Error("The AI model could not be downloaded.")

	const total = Number(response.headers.get("content-length"))

	return trackProgress(
		response.body,
		total,
		loaded => onProgress(loaded, total),
	)
}

function trackProgress(
	stream: ReadableStream<Uint8Array>,
	total: number,
	onProgress: (loaded: number) => void,
) {
	let loaded = 0

	return stream.pipeThrough(new TransformStream({
		transform(chunk, controller) {
			loaded += chunk.byteLength
			onProgress(loaded)
			controller.enqueue(chunk)
		},

		flush() {
			if (total && loaded !== total)
				throw new Error("The AI model download was incomplete.")
		},
	}))
}

