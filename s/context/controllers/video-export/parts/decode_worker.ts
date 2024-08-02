import {VideoEffect} from "../../../types.js"

let timestamp = 0
let decoded_effect: VideoEffect
let number = 0
let timebase = 0
let timestamp_end = 0
let fps = 0
let wait_time = 0
let skipped = 0

const decoder = new VideoDecoder({
	output(frame) {
		wait_time = 0
		number += 1

		const frameTimestamp = frame.timestamp / 1000
		if(frameTimestamp < decoded_effect.start) {
			frame.close()
			return
		}

		const skipEvery = Math.ceil(fps / (fps - timebase))
		// skipping frames to normalize to timebase
		if ((number) % skipEvery === 0) {
			frame.close()
			skipped += 1
		}

		else {
			timestamp += 1000/25
			self.postMessage({
				action: "new-frame",
				frame: {
					timestamp: timestamp,
					frame,
					effect_id: decoded_effect.id,
				}
			})
			frame.close()
		}
		frame.close()
	},
	error: (e) => console.log(e)
})

const interval = setInterval(async()  => {
	if(timestamp >= timestamp_end) {
		self.postMessage({action: "end"})
	}
	wait_time += 100
}, 100)

decoder.addEventListener("dequeue", () => {
	self.postMessage({action: "dequeue", size: decoder.decodeQueueSize})
})

self.addEventListener("message", async message => {
	if(message.data.action === "demux") {
		decoded_effect = message.data.effect
		timestamp = message.data.starting_timestamp
		timebase = message.data.timebase
		timestamp_end = (message.data.starting_timestamp) + (message.data.effect.end - decoded_effect.start)
		// frames = message.data.frames
		// fps = (message.data.frames) / (message.data.effect.raw_duration / 1000)
		const frames = calculateAmountOfFramesToDecode(decoded_effect)
		fps = frames / ((decoded_effect.end - decoded_effect.start) / 1000)
	}
	if(message.data.action === "configure") {
		decoder.configure(message.data.config)
		await decoder.flush()
	}
	if(message.data.action === "chunk") {
		decoder.decode(message.data.chunk)
	}
})

function calculateAmountOfFramesToDecode(effect: VideoEffect) {
	const fps = effect.frames / (effect.raw_duration / 1000)
	return Math.round((effect.end - effect.start) / 1000 * fps)
}
