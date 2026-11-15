
import {
	ALL_FORMATS,
	BlobSource,
	Conversion,
	Input,
	Mp4OutputFormat,
	Output,
	StreamTarget
} from 'mediabunny'
import type {MediaPart} from './types.js'
import {onAbort} from './abort.js'

const MAX_PART_SIZE = 1_900_000_000
// Leave room for packet-boundary padding when remuxing video.
const MAX_PART_DURATION = 2 * 60 * 60 - 1
const DIRECTORY_NAME = 'omniclip-analysis'

export type MediaSplitOptions = {audioOnly?: boolean; start?: number; end?: number}

/**
 * Splits source media into temporary parts for cloud analysis.
 * Parts use MP4/M4A, copying codecs when possible and converting when necessary.
 * Parts are written into OPFS one at a time, uploaded, then deleted.
 */
export class MediaSplitter {
	#input: Input
	extension: string
	#directory?: FileSystemDirectoryHandle

	constructor(
		readonly source: Blob,
		filename: string,
		readonly options: MediaSplitOptions = {},
		readonly signal?: AbortSignal,
	) {
		this.extension = filename.slice(filename.lastIndexOf('.')).toLowerCase()
		this.#input = new Input({
			formats: ALL_FORMATS,
			source: new BlobSource(source)
		})
	}

	async *split(): AsyncGenerator<MediaPart> {
		try {
			this.signal?.throwIfAborted()
			const duration = await this.#input.computeDuration()

			let start = this.options.start ?? 0
			const end = this.options.end ?? duration
			const audio = this.options.audioOnly || this.source.type.startsWith('audio/')
			if (this.options.audioOnly && !(await this.#input.getPrimaryAudioTrack()))
				throw new Error('The source has no audio track to analyze.')

			const maxDuration = audio ? 3 * 60 * 60 - 1 : MAX_PART_DURATION
			if (!this.options.audioOnly && start === 0 && end === duration && this.source.size <= MAX_PART_SIZE && duration <= maxDuration) {
				yield {
					blob: this.source,
					start: 0,
					end: duration
				}

				return
			}

			this.extension = audio ? '.m4a' : '.mp4'

			const partDuration = Math.min(
				duration * MAX_PART_SIZE / this.source.size,
				maxDuration,
			)
			while (start < end) {
				const result = await this.#createPart(
					start,
					Math.min(start + partDuration, end),
				)

				yield result

				start = result.end
			}
		} finally {
			this.#input.dispose()
			if (this.#directory) {
				const root = await navigator.storage.getDirectory()
				const directory = await root.getDirectoryHandle(DIRECTORY_NAME)
				await directory.removeEntry(this.#directory.name, {recursive: true})
			}
		}
	}

	async #createPart(
		start: number,
		initialEnd: number,
	): Promise<MediaPart> {
		const directory = await this.#getDirectory()
		const handle = await directory.getFileHandle(`part${this.extension}`, {create: true})

		let end = initialEnd

		while (true) {
			const blob = await this.#remux(handle, start, end)

			if (blob.size <= MAX_PART_SIZE)
				return {blob, start, end}

			end = start + (end - start) * MAX_PART_SIZE / blob.size * 0.98
		}
	}

	async #remux(
		handle: FileSystemFileHandle,
		start: number,
		end: number,
	) {
		const output = new Output({
			format: new Mp4OutputFormat(),
			target: new StreamTarget(await handle.createWritable())
		})

		const conversion = await Conversion.init({
			input: this.#input,
			output,
			trim: {start, end},
			video: this.options.audioOnly ? {discard: true} : undefined,
			showWarnings: false
		})

		if (!conversion.isValid) {
			await output.cancel()
			throw new Error('Could not prepare media for cloud analysis')
		}

		const cleanup = onAbort(this.signal, () => {void conversion.cancel()})
		try {
			await conversion.execute()
		}
		finally {
			cleanup()
		}

		return handle.getFile()
	}

	async #getDirectory() {
		if (this.#directory)
			return this.#directory

		const root = await navigator.storage.getDirectory()

		const directory = await root.getDirectoryHandle(DIRECTORY_NAME, {create: true})
		return this.#directory = await directory.getDirectoryHandle(crypto.randomUUID(), {create: true})
	}

	static async clearTemporaryMedia() {
		const root = await navigator.storage.getDirectory()
		await root.removeEntry(DIRECTORY_NAME, {recursive: true}).catch(() => {})
	}
}

