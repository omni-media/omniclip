import {VideoEffect} from "../../../types.js"

let timestamp = 0
let end_timestamp = 0
let interval_number = 0
let decoded_effect: VideoEffect
let frames = 0
let timestamp_start = 0
let timebase = 25

const decoder = new VideoDecoder({
	output(frame) {
		timestamp += (decoded_effect.duration / decoded_effect.frames)
		if(timestamp >= timestamp_start + decoded_effect.start && timestamp <= timestamp_start + decoded_effect.end + 100) {
			self.postMessage({action: "new-frame", frame: {timestamp: timestamp - decoded_effect.start, frame, effect_id: decoded_effect.id, frames_count: frames}}, [frame])
			frame.close()
		} else {
			frame.close()
		}
	},
	error: (e) => console.log(e)
})

const interval = () => setInterval(async () => {
	if(timestamp >= end_timestamp) {
		clearInterval(interval_number)
	}
}, 100)

decoder.addEventListener("dequeue", () => {
	self.postMessage({action: "dequeue", size: decoder.decodeQueueSize})
})

self.addEventListener("message", async message => {
	if(message.data.action === "demux") {
		timestamp_start = message.data.starting_timestamp
		decoded_effect = message.data.effect
		timestamp = message.data.starting_timestamp
		end_timestamp = (message.data.starting_timestamp) + message.data.effect.end
		interval_number = interval()
		timebase = message.data.timebase
		frames = message.data.frames
	}
	if(message.data.action === "configure") {
		decoder.configure(message.data.config)
		await decoder.flush()
	}
	if(message.data.action === "chunk") {
		decoder.decode(message.data.chunk)
	}
	if(message.data.action === "get-queue") {
		self.postMessage({action: "dequeue", size: decoder.decodeQueueSize})
	}
	if(message.data.action === "end") {
		await decoder.flush()
	}
})
