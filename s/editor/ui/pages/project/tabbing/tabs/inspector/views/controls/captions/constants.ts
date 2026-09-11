
import {makeTranscriber} from "@omnimedia/omnitool"
export {transcriberModels, type TranscriberModel} from "../../../../../../../../logic/models/transcriber.js"

export const LANGUAGES = [
	["", "Auto-Detect"],
	["english", "English"],
	["polish", "Polish"],
	["spanish", "Spanish"],
	["french", "French"],
	["german", "German"],
	["italian", "Italian"],
] as const

export const transcriberWorkerPath = new URL(
	"/node_modules/@omnimedia/omnitool/x/features/speech/transcribe/worker.bundle.min.js",
	import.meta.url
)

export type CaptionConfigKey = "maxChars" | "maxDuration" | "maxSilence"
export type Transcriber = Awaited<ReturnType<typeof makeTranscriber>>
