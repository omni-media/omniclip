import {MP4Demuxer} from "../../../../tools/mp4boxjs/demuxer.js"
import {VideoEffect} from "../../../../context/controllers/timeline/types.js"

let timestamp = 0
let end_timestamp = 0
let wait_time = 0
let interval_number = 0
let decoded_effect: VideoEffect
let frames = 0

const decoder = new VideoDecoder({
	async output(frame) {
		const canvas = new OffscreenCanvas(150, 50)
		const ctx = canvas.getContext("2d")
		ctx?.drawImage(frame, 0, 0, 150, 50)
		const blob = await canvas.convertToBlob({type: "image/webp", quality: 0.5})
		const url = URL.createObjectURL(blob)
		self.postMessage({action: "new-frame", url})
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
	setStatus() {},
})

self.addEventListener("message", async message => {
	if(message.data.action === "demux") {
		decoded_effect = message.data.effect
		interval_number = interval()
		demux(message.data.effect.file)
	}
})
