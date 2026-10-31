
import {ALL_FORMATS, BlobSource, CanvasSink, Input} from "mediabunny"

export const videoFrameInterval = 5

export async function* sampleFrames(blob: Blob, startAt = 0) {
	const input = new Input({source: new BlobSource(blob), formats: ALL_FORMATS})
	try {
		const track = await input.getPrimaryVideoTrack()
		if (!track) throw new Error("Video track unavailable")
		const duration = await track.computeDuration()
		const first = await track.getFirstTimestamp()
		const total = Math.ceil(duration / videoFrameInterval)
		const times = Array.from({length: Math.ceil((duration - startAt) / videoFrameInterval)}, (_, i) => startAt + i * videoFrameInterval)
		if (!times.length) return
		const sink = new CanvasSink(track, {width: Math.min(await track.getDisplayWidth(), 512), poolSize: 1})
		for await (const frame of sink.canvasesAtTimestamps(times.map(time => Math.max(time, first)))) {
			if (!frame) throw new Error("Video frame unavailable")
			const image = await (frame.canvas as OffscreenCanvas).convertToBlob({type: "image/jpeg", quality: 0.85})
			yield {image: await image.arrayBuffer(), total}
		}
	}
	finally {input.dispose()}
}
