import {VideoEffect} from "../../../types.js"

let timestamp = 0
let decoded_effect: VideoEffect
let frames = 0
let number = 0
let timebase = 0
let timestamp_end = 0
let fps = 0
let wait_time = 0

const decoder = new VideoDecoder({
	output(frame) {
		wait_time = 0
		number += 1
		const skipEvery = Math.ceil(fps / (fps - timebase))
		// skipping frames to normalize to timebase
		if (number % skipEvery === 0) {
			frame.close()
		}

		else {
			timestamp += (decoded_effect.duration / decoded_effect.frames)
			self.postMessage({
				action: "new-frame",
				frame: {
					timestamp: timestamp,
					frame,
					effect_id: decoded_effect.id,
					frames_count: frames
				}
			})
			frame.close()
		}

	},
	error: (e) => console.log(e)
})

const interval = setInterval(async()  => {
	if(wait_time >= 5000 && wait_time % 1000 === 0 && decoder.state === "configured") {
		await decoder.flush()
	}
	if(timestamp >= timestamp_end) {
		clearInterval(interval)
		self.postMessage({action: "end"})
		decoder.close()
		self.close()
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
		frames = message.data.frames
		timebase = message.data.timebase
		timestamp_end = (message.data.starting_timestamp) + message.data.effect.end
		fps = (message.data.frames - 2) / (message.data.effect.duration / 1000)
	}
	if(message.data.action === "configure") {
		decoder.configure(message.data.config)
		await decoder.flush()
	}
	if(message.data.action === "chunk") {
		decoder.decode(message.data.chunk)
	}
})
