
import {ALL_FORMATS, AudioSampleSink, BlobSource, Input, type AudioSample} from "mediabunny"

export const audioChunkInterval = 5
const rate = 16_000
const size = audioChunkInterval * rate

function mono(sample: AudioSample) {
	const {numberOfFrames: frames, numberOfChannels: channels} = sample
	const mixed = new Float32Array(frames)
	const plane = new Float32Array(frames)
	try {
		for (let c = 0; c < channels; c++) {
			sample.copyTo(plane, {format: "f32-planar", planeIndex: c})
			for (let k = 0; k < frames; k++) mixed[k] += plane[k] / channels
		}
		return mixed
	} finally { sample.close() }
}

export async function* sampleAudio(blob: Blob, startAt = 0) {
	const input = new Input({source: new BlobSource(blob), formats: ALL_FORMATS})
	try {
		const track = await input.getPrimaryAudioTrack()
		if (!track) return
		const duration = await track.computeDuration()
		const total = Math.ceil(duration / audioChunkInterval)
		const end = Math.max(0, Math.round((duration - startAt) * rate))
		const count = Math.ceil(end / size)
		const alloc = (i: number) => new Float32Array(Math.max(0, Math.min(size, end - i * size)))
		const chunk = (audio: Float32Array) => ({audio, total})
		let i = 0
		let audio = alloc(0)
		for await (const sample of new AudioSampleSink(track).samples(startAt)) {
			const {timestamp, sampleRate} = sample
			const data = mono(sample)
			const first = Math.round((timestamp - startAt) * rate)
			const frames = Math.round(data.length * rate / sampleRate)
			for (let j = Math.max(0, -first); j < frames; j++) {
				const position = first + j
				if (position >= end) break
				while (position >= (i + 1) * size) { yield chunk(audio); audio = alloc(++i) }
				audio[position - i * size] = data[Math.floor(j * sampleRate / rate)]
			}
		}
		while (i < count) { yield chunk(audio); audio = alloc(++i) }
	} finally { input.dispose() }
}

