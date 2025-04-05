/// <reference lib="webworker" />
//@ts-ignore
import {pipeline, WhisperTextStreamer, PipelineType} from "./transformers.min.js"

type ProgressCallback = (data: any) => void

interface TranscriptionChunk {
	text: string
	offset: number
	timestamp: [number, number | null]
	finalised: boolean
}

interface TranscriptionMessage {
	audio: Float32Array
	model: string
	subtask: string | null
	language: string | null
}

interface TranscriptionResult {
	text: string
	chunks: TranscriptionChunk[]
	tps: number
}

abstract class PipelineFactory {
	static task: PipelineType
	static model: string | undefined = undefined
	static instance: any = null

	constructor(
		public tokenizer: any,
		public model: any
	) {
		this.tokenizer = tokenizer;
		this.model = model;
	}

	static async getInstance(progressCallback?: ProgressCallback) {
		if (this.instance === null) {
			this.instance = pipeline(this.task, this.model, {
				dtype: {
					encoder_model:
						this.model === "onnx-community/whisper-large-v3-turbo"
							? "fp16"
							: "fp32",
					decoder_model_merged: "q4",
				},
				device: "webgpu",
				progress_callback: progressCallback,
			})
		}
		return this.instance
	}
}

//@ts-ignore
class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
	static override task = "automatic-speech-recognition"
}

self.addEventListener("message", async (event) => {
	const message = event.data as TranscriptionMessage

	try {
		const transcript = await transcribe(message)
		if (!transcript) return

		self.postMessage({
			status: "complete",
			data: transcript,
		})
	} catch (error) {
		console.error(error)
		self.postMessage({ status: "error", data: error })
	}
})

async function transcribe({
	audio,
	model,
	subtask,
	language,
}: TranscriptionMessage): Promise<TranscriptionResult | null> {
	const isDistil = model.startsWith("distil-whisper/")
	const Factory = AutomaticSpeechRecognitionPipelineFactory

	if (Factory.model !== model) {
		Factory.model = model
		if (Factory.instance !== null) {
			;(await Factory.getInstance()).dispose?.()
			Factory.instance = null
		}
	}

	const transcriber = await Factory.getInstance((data) =>
																								{self.postMessage(data); console.log(data.progress)}
	)
	const timePrecision =
		transcriber.processor.feature_extractor.config.chunk_length /
		transcriber.model.config.max_source_positions

	const chunkLength = isDistil ? 20 : 30
	const strideLength = isDistil ? 3 : 5

	const chunks: TranscriptionChunk[] = []
	let chunkCount = 0
	let startTime: number | null = null
	let tokenCount = 0
	let tps = 0

	const streamer = new WhisperTextStreamer(transcriber.tokenizer, {
		time_precision: timePrecision,
		on_chunk_start: (offset: any) => {
			const base = (chunkLength - strideLength) * chunkCount
			chunks.push({
				text: "",
				timestamp: [base + offset, null],
				finalised: false,
				offset: base,
			})
		},
		token_callback_function: () => {
			startTime ??= performance.now()
			if (++tokenCount > 1) {
				tps = (tokenCount / (performance.now() - startTime)) * 1000
			}
		},
		callback_function: (textChunk: any) => {
			// console.log("halo", textChunk, chunks)
			if (!chunks.length) return
			chunks[chunks.length - 1].text += textChunk
			self.postMessage({
				status: "update",
				data: {
					text: "",
					chunks,
					tps,
				},
			})
		},
		on_chunk_end: (endOffset: any) => {
			const current = chunks.at(-1)
			if (current) {
				current.timestamp[1] = endOffset + current.offset
				current.finalised = true
			}
		},
		on_finalize: () => {
			startTime = null
			tokenCount = 0
			chunkCount++
		},
	})

	const output = await transcriber(audio, {
		top_k: 0,
		do_sample: false,
		chunk_length_s: chunkLength,
		stride_length_s: strideLength,
		language,
		task: subtask,
		return_timestamps: "word",
		force_full_sequences: false,
		streamer,
	}).catch((err: any) => {
		console.error(err)
		self.postMessage({ status: "error", data: err })
		return null
	})

	if (!output) return null

	return {
		tps,
		...output,
	}
}
