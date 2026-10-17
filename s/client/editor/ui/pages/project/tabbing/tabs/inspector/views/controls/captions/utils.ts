
import {Transcription, TranscriptSegment} from "@omnimedia/omnitool"

export function makePreview(transcript: Transcription, maxChars: number): TranscriptSegment[] {
	const segments: TranscriptSegment[] = []
	let current: TranscriptSegment | null = null

	for (const chunk of transcript.chunks) {
		const text = chunk.text.trim()
		if (!text) continue

		const nextText = current ? `${current.text} ${text}` : text
		if (!current || nextText.length > maxChars) {
			current = {text, timestamp: [...chunk.timestamp]}
			segments.push(current)
		}
		else {
			current.text = nextText
			current.timestamp = [current.timestamp[0], chunk.timestamp[1]]
		}
	}

	return segments
}

export function formatRange([start, end]: [number, number]) {
	return `${formatSeconds(start)} - ${formatSeconds(end)}`
}

function formatSeconds(s: number) {
	const t = Math.max(0, Math.floor(s))
	return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`
}

