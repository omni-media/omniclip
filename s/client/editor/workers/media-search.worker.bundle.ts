
import {concurrent, queue} from "@e280/stz"
import {autoTransfer, offerWorkerPort} from "@e280/renraku/web"
import {makeEndpoint, makePortal, Messenger} from "@e280/renraku"
import {FilesetResolver, UniversalEmbedder, type UniversalEmbedderResult} from "@mediapipe/tasks-retrieval"

import {exposeErrors} from "../ui/logic/utils/expose-errors.js"
import {SearchEngine} from "../ui/pages/project/tabbing/tabs/browser/search/engine.js"
import {modelCache, modelUrl} from "../ui/pages/project/tabbing/tabs/browser/search/model.js"
import type {EmbeddingInput, SearchHost, SearchWorker} from "../ui/pages/project/tabbing/tabs/browser/search/types.js"

let host: SearchHost
let engine: SearchEngine
let model: UniversalEmbedder | undefined

async function loadModel() {
	const cache = await caches.open(modelCache)
	const cached = await cache.match(modelUrl)
	return cached ?? downloadModel(cache)
}

async function downloadModel(cache: Cache) {
	const response = await fetch(modelUrl)
	if (!response.ok || !response.body) throw new Error("Couldn't download the search model. Please try again.")

	const total = Number(response.headers.get("content-length"))
	let loaded = 0
	let reported = 0
	const download = response.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
		transform(chunk, controller) {
			loaded += chunk.byteLength
			if (loaded - reported >= 1_000_000 || loaded === total) {
				reported = loaded
				void host.progress({kind: "download", stage: "Downloading model", loaded, total})
			}
			controller.enqueue(chunk)
		},
	}))
	const blob = await new Response(download).blob()
	const downloaded = new Response(blob)

	try { await cache.put(modelUrl, new Response(blob)) }
	catch { void host.notice("The model couldn't be saved in browser storage. It will work for this session, but may need downloading again.") }

	return downloaded
}

async function initialize() {
	if (model) return model
	if (!navigator.gpu) throw new Error("AI search needs a browser with WebGPU enabled.")
	const response = await loadModel()
	void host.downloaded()
	void host.progress({kind: "prepare", stage: "Preparing model", loaded: 0, total: 0})
	const {fileset, device} = await concurrent({
		fileset: FilesetResolver.forRetrievalTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-retrieval@1.1.1/wasm", true),
		device: UniversalEmbedder.createWebGpuDevice(),
	})
	model = await UniversalEmbedder.createFromOptions(fileset, {
		baseOptions: {modelAssetBuffer: response.body!.getReader(), device}, l2Normalize: true,
	})
	return model
}

function vectorOf(result: UniversalEmbedderResult): number[] {
	// This embedder returns float embeddings because scalar quantization isn't enabled.
	return result.embeddings[0].floatEmbedding!
}

const embed = queue(async (input: EmbeddingInput) => {
	const embedder = await initialize()
	if ("text" in input) {
		const result = await embedder.embedText(`task: search result | query: ${input.text.trim()}`)
		return vectorOf(result)
	}
	if ("audio" in input) {
		const result = await embedder.embedAudio(input.audio)
		return vectorOf(result)
	}
	const result = await embedder.embedImage(new Uint8Array(input.image))
	return vectorOf(result)
})

const api: SearchWorker = {
	prepare: exposeErrors(async() => {
		await initialize()
	}),
	index: exposeErrors((record, file) => engine.index(record, file)),
	search: exposeErrors((query, hashes) => engine.search(query, hashes)),
	cancel: () => engine.cancel(),
	remove: exposeErrors(hash => engine.remove(hash)),
}
const port = await offerWorkerPort()
const portal = makePortal({
	port,
	messenger: new Messenger<SearchHost>(makeEndpoint(api), Infinity),
	autoTransfer,
})
host = portal.remote
engine = new SearchEngine(embed, host)

