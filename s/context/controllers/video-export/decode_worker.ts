import {VideoEffect} from "../timeline/types.js"
import {MP4Demuxer} from "../../../tools/mp4boxjs/demuxer.js"

let timestamp = 0
let end_timestamp = 0
let wait_time = 0
let interval_number = 0
let decoded_effect: VideoEffect
let frames = 0

const decoder = new VideoDecoder({
	output(frame) {
		self.postMessage({action: "new-frame", frame: {timestamp, frame, effect_id: decoded_effect.id, frames_count: frames}})
		frame.close()
		timestamp += decoded_effect.duration / frames
		wait_time = 0
	},
	error: (e) => console.log(e)
})

const interval = () => setInterval(() => {
	wait_time += 100
	if(wait_time === 200) {
		decoder.flush()
	}
	if(timestamp === end_timestamp) {
		clearInterval(interval_number)
	}
}, 100)

const demux = (file: File) => new MP4Demuxer(file, {
	async onConfig(config: VideoDecoderConfig) {
		decoder.configure({...config})
		await decoder.flush()
	},
	async onChunk(chunk: EncodedVideoChunk) {
		decoder.decode(chunk)
		end_timestamp += decoded_effect.duration / frames
	},
	framesCount(frames_count) {
		frames = frames_count
	},
	setStatus() {}
})

self.addEventListener("message", async message => {
	if(message.data.action === "demux") {
		timestamp = message.data.starting_timestamp
		end_timestamp = message.data.starting_timestamp
		decoded_effect = message.data.effect
		interval_number = interval()
		demux(message.data.effect.file)
	}
})
