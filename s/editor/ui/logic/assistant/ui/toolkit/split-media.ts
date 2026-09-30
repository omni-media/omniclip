import {
	ALL_FORMATS,
	BlobSource,
	Conversion,
	Input,
	Mp4OutputFormat,
	Output,
	StreamTarget
} from 'mediabunny'

const MAX_PART_SIZE = 1_900_000_000
const MAX_PART_DURATION = 2 * 60 * 60
const DIRECTORY = 'omniclip-analysis'

export type MediaPart = {
	blob: Blob
	start: number
	end: number
}

/**
 * Splits source media into temporary parts for cloud analysis.
 * Each part stays below Qwen's two-hour and two-gigabyte limits, with a 1.9 GB margin.
 * Parts are remuxed into OPFS one at a time, uploaded by the caller, then deleted.
 */
export class MediaSplitter {
	#input: Input
	#directory?: FileSystemDirectoryHandle

	constructor(readonly source: Blob) {
		this.#input = new Input({
			formats: ALL_FORMATS,
			source: new BlobSource(source)
		})
	}

	async *split(): AsyncGenerator<MediaPart> {
		try {
			const duration = await this.#input.computeDuration()

			if (this.source.size <= MAX_PART_SIZE) {
				yield {
					blob: this.source,
					start: 0,
					end: duration
				}

				return
			}

			const partDuration = Math.min(
				duration * MAX_PART_SIZE / this.source.size,
				MAX_PART_DURATION,
			)
			let start = 0
			let part = 1

			while (start < duration) {
				const result = await this.#createPart(
					part,
					start,
					Math.min(start + partDuration, duration),
				)

				yield result

				start = result.end
				part++
			}
		} finally {
			this.#input.dispose()
		}
	}

	async #createPart(
		part: number,
		start: number,
		initialEnd: number,
	): Promise<MediaPart> {
		const directory = await this.#getDirectory()
		const name = `part-${part}.mp4`
		const handle = await directory.getFileHandle(name, {create: true})

		let end = initialEnd

		try {
			while (true) {
				const blob = await this.#remux(handle, start, end)

				if (blob.size <= MAX_PART_SIZE)
					return {blob, start, end}

				end = start + (end - start) * MAX_PART_SIZE / blob.size * 0.98
			}
		} finally {
			await directory.removeEntry(name).catch(() => {})
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
			showWarnings: false
		})

		if (!conversion.isValid)
			throw new Error('Could not remux media for cloud analysis')

		await conversion.execute()

		return handle.getFile()
	}

	async #getDirectory() {
		if (this.#directory)
			return this.#directory

		const root = await navigator.storage.getDirectory()

		return this.#directory = await root.getDirectoryHandle(DIRECTORY, {
			create: true
		})
	}

	static async clearTemporaryMedia() {
		const root = await navigator.storage.getDirectory()
		await root.removeEntry(DIRECTORY, {recursive: true}).catch(() => {})
	}
}
