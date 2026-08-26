
import {Cellar} from "@e280/quay"

import {assistantModelId, builtinModelMetadata} from "./builtins.js"

const transformersCacheName = "transformers-cache"

export type CachedModel = {
	id: string
	label: string
	purpose: string
	size: number
	storage: "assistant" | "transformers"
}

export type ModelStorage = {
	models: CachedModel[]
	modelsUsed: number
	used: number
	quota: number
	available: number
}

export async function inspectModelStorage(): Promise<ModelStorage> {
	const models = [
		...await inspectAssistantModel(),
		...await inspectTransformersModels(),
	]
	const {usage = 0, quota = 0} = await navigator.storage.estimate()
	return {
		models,
		quota,
		used: usage,
		available: Math.max(0, quota - usage),
		modelsUsed: models.reduce((total, model) => total + model.size, 0),
	}
}

export async function removeCachedModel(model: CachedModel) {
	if (model.storage === "assistant") {
		await (await Cellar.opfs(assistantModelId)).clear()
		return
	}

	const cache = await caches.open(transformersCacheName)
	for (const request of await cache.keys())
		if (modelId(request.url) === model.id)
			await cache.delete(request)
}

async function inspectAssistantModel(): Promise<CachedModel[]> {
	const cellar = await Cellar.opfs(assistantModelId)
	let size = 0

	for await (const hash of cellar.list())
		size += (await cellar.load(hash)).file.size

	return size ? [{
		id: assistantModelId,
		...builtinModelMetadata[assistantModelId],
		size,
		storage: "assistant",
	}] : []
}

async function inspectTransformersModels(): Promise<CachedModel[]> {
	if (!("caches" in globalThis))
		return []

	const cache = await caches.open(transformersCacheName)
	const grouped = new Map<string, number>()

	for (const request of await cache.keys()) {
		const id = modelId(request.url)
		if (!id)
			continue

		const response = await cache.match(request)
		if (response)
			grouped.set(id, (grouped.get(id) ?? 0) + (await response.blob()).size)
	}

	return [...grouped].map(([id, size]) => {
		const metadata = builtinModelMetadata[id] ?? {label: id, purpose: "AI model"}
		return {id, ...metadata, size, storage: "transformers" as const}
	})
}

function modelId(url: string) {
	const parsed = new URL(url)
	if (parsed.hostname !== "huggingface.co")
		return

	const parts = parsed.pathname.split("/").filter(Boolean)
	const resolve = parts.indexOf("resolve")
	if (resolve < 2)
		return

	return parts.slice(0, resolve).map(decodeURIComponent).join("/")
}

export function formatBytes(bytes: number) {
	if (!bytes)
		return "0 B"

	const units = ["B", "KB", "MB", "GB", "TB"]
	const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
	const value = bytes / 1024 ** unit
	return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`
}
