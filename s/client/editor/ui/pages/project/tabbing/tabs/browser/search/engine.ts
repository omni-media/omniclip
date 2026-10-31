
import {sampleAudio, audioChunkInterval} from "./audio.js"
import {sampleFrames, videoFrameInterval} from "./frames.js"
import type {EmbeddingInput, MediaIndex, MediaRecord, SearchHost} from "./types.js"

const indexCache = "omniclip-media-search-vectors"
const indexKey = (hash: string) => new URL(`/__media-search/${hash}`, location.origin).href

function similarity(a: number[], b: number[]) {
	return a.reduce((sum, value, index) => sum + value * b[index], 0)
}

export class SearchEngine {
	#indexes = new Map<string, MediaIndex>()
	#job?: {hash: string}

	constructor(private embed: (input: EmbeddingInput) => Promise<number[]>, private host: SearchHost) {}

	async cancel() {
		this.#job = undefined
	}

	async remove(hash: string) {
		if (this.#job?.hash === hash) this.#job = undefined
		this.#indexes.delete(hash)
		const cache = await caches.open(indexCache)
		await cache.delete(indexKey(hash))
	}

	async index(record: MediaRecord, file: Blob) {
		const job = this.#job = {hash: record.hash}
		const active = () => this.#job === job
		const cache = await caches.open(indexCache)
		if (!active()) return false
		const entry = this.#indexes.get(record.hash)
			?? await cache.match(indexKey(record.hash)).then(response => response?.json())
			?? {visual: [], audio: [], phase: "working"}
		if (!active()) return false
		this.#indexes.set(record.hash, entry)
		if (entry.phase === "done") return true
		try { return await this.#indexMedia(record, file, entry, active) }
		finally {await this.#saveIndex(cache, record.hash, entry)}
	}

	async #indexMedia(record: MediaRecord, file: Blob, entry: MediaIndex, active: () => boolean) {
		if (record.format === "image") entry.visual.push({vector: await this.embed({image: await file.arrayBuffer()})})
		else {
			const phases = record.format === "audio" ? ["audio"] as const : ["video", "audio"] as const
			for (const kind of phases) {
				if (!active()) return false
				const indexed = kind === "audio" ? entry.audio : entry.visual
				const start = indexed.length * (kind === "video" ? videoFrameInterval : audioChunkInterval)
				const source = kind === "video" ? sampleFrames(file, start) : sampleAudio(file, start)
				for await (const {total, ...input} of source) {
					if (!active()) return false
					indexed.push({vector: await this.embed(input)})
					await this.#report(record, kind, indexed.length / total)
					if (!active()) return false
				}
				if (!active()) return false
				await this.#report(record, kind, 1)
			}
		}
		entry.phase = "done"
		return active()
	}

	async #saveIndex(cache: Cache, hash: string, entry: MediaIndex) {
		if (this.#indexes.get(hash) !== entry) return
		try {
			await cache.put(indexKey(hash), new Response(JSON.stringify(entry)))
			if (this.#indexes.get(hash) !== entry) await cache.delete(indexKey(hash))
		}
		catch {void this.host.notice("The index couldn't be saved. Media may need indexing again next time.")}
	}

	#report(record: MediaRecord, kind: "video" | "audio", progress: number) {
		const fraction = record.format === "video" ? (progress + (kind === "audio" ? 1 : 0)) / 2 : progress
		return this.host.progress({
			kind: "index",
			stage: `Indexing ${record.label} · ${Math.floor(fraction * 100)}%`,
			loaded: fraction,
			total: 1,
			hash: record.hash,
		})
	}

	async search(query: string, hashes: string[]): Promise<[string, number][]> {
		const vector = await this.embed({text: query})
		const matches: [string, number][] = []
		for (const hash of hashes) {
			const entry = this.#indexes.get(hash)
			if (!entry) continue
			const score = entry.audio.reduce((best, sample) =>
				Math.max(best, similarity(sample.vector, vector)), entry.visual.reduce((best, sample) =>
					Math.max(best, similarity(sample.vector, vector)), -Infinity))
			if (score >= 0.7) matches.push([hash, score])
		}
		return matches.sort((a, b) => b[1] - a[1]).slice(0, 20)
	}
}

