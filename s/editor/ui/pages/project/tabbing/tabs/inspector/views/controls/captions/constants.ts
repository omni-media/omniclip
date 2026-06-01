
import {makeTranscriber} from "@omnimedia/omnitool"

export const LANGUAGES = [
	["", "Auto-Detect"],
	["english", "English"],
	["polish", "Polish"],
	["spanish", "Spanish"],
	["french", "French"],
	["german", "German"],
	["italian", "Italian"],
] as const

export const TRANSCRIBER_MODELS = [
	["onnx-community/whisper-tiny_timestamped", "Whisper Tiny"],
	["onnx-community/whisper-base_timestamped", "Whisper Base"],
	["onnx-community/whisper-small_timestamped", "Whisper Small"],
] as const

export const transcriberWorkerPath = new URL(
	"/node_modules/@omnimedia/omnitool/x/features/speech/transcribe/worker.bundle.min.js",
	import.meta.url
)

export type CaptionConfigKey = "maxChars" | "maxDuration" | "maxSilence"
export type TranscriberModel = typeof TRANSCRIBER_MODELS[number][0]
export type Transcriber = Awaited<ReturnType<typeof makeTranscriber>>
