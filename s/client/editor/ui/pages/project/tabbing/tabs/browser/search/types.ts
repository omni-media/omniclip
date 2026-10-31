import type {MediaFormat} from "@e280/quay"

type VectorSample = {vector: number[]}
export type MediaRecord = {hash: string, label: string, format: MediaFormat}
export type EmbeddingInput = {text: string} | {image: ArrayBuffer} | {audio: Float32Array}
export type MediaIndex = {visual: VectorSample[], audio: VectorSample[], phase: "working" | "done"}

export type Progress = {
	kind: "download" | "prepare" | "index" | "idle" | "check"
	stage: string
	loaded: number
	total: number
	hash?: string
}

export type SearchWorker = {
	prepare(): Promise<void>
	index(record: MediaRecord, file: Blob): Promise<boolean>
	search(query: string, hashes: string[]): Promise<[string, number][]>
	cancel(): Promise<void>
	remove(hash: string): Promise<void>
}

export type SearchHost = {
	progress(data: Progress): Promise<void>
	notice(message: string): Promise<void>
	downloaded(): Promise<void>
}

