import {MP4Demuxer} from "../../../tools/mp4boxjs/demuxer.js"
import {BinaryAccumulator} from "./tools/BinaryAccumulator/tool.js"

const binary_accumulator = new BinaryAccumulator()
const frames: {timestamp: number, frame: VideoFrame, effect_id: string}[] = []
let timestamp = 0
let end_timestamp = 0
let wait_time = 0
let interval_number = 0
let currently_decoded_effect = ""

function draw_blank_canvas() {
	const canvas = new OffscreenCanvas(720, 1280)
	const ctx = canvas.getContext("2d")
	ctx!.fillStyle = "blue";
	ctx!.fillRect(0, 0, canvas.width, canvas.height);
}

async function handleChunk(chunk: EncodedVideoChunk) {
	const chunkData = new Uint8Array(chunk.byteLength);
	chunk.copyTo(chunkData)
	binary_accumulator.addChunk(chunkData)
}

const decoder = new VideoDecoder({
	async output(frame) {
		frames.push({timestamp, frame, effect_id: currently_decoded_effect})
		timestamp += 1000/30
		wait_time = 0
	},
	error: (e) => console.log(e)
})

const interval = () => setInterval(() => {
	wait_time += 10
	if(wait_time === 500) {
		decoder.flush()
	}
	if(timestamp === end_timestamp)
		clearInterval(interval_number)
}, 10)

const demux = (file: File) => new MP4Demuxer(file, {
	async onConfig(config: VideoDecoderConfig) {
		decoder.configure(config)
		await decoder.flush()
	},
	async onChunk(chunk: EncodedVideoChunk) {
		decoder.decode(chunk)
		
		end_timestamp += 1000/30
	},
	setStatus() {}
})


// for later: https://github.com/gpac/mp4box.js/issues/243
const config: VideoEncoderConfig = {
	codec: "avc1.4d002a", // avc1.42001E / avc1.4d002a / avc1.640034
	avc: {format: "annexb"},
	width: 1280,
	height: 720,
	bitrate: 4_000_000, // 2 Mbps
	framerate: 30,
	bitrateMode: "constant"
}

const encoder = new VideoEncoder({
	output: handleChunk,
	error: (e: any) => {
		console.log(e.message)
	},
})

encoder.configure(config)

self.addEventListener("message", async message => {
	if(message.data.action === "encode") {
		const frame = message.data.frame as VideoFrame
		encoder.encode(frame)
		frame.close()
	}
	if(message.data.action === "get-binary") {
		self.postMessage({action: "binary", binary: binary_accumulator.binary})
	}
	if(message.data.action === "demux") {
		timestamp = message.data.starting_timestamp
		end_timestamp = message.data.starting_timestamp
		currently_decoded_effect = message.data.effect.id
		interval_number = interval()
		demux(message.data.effect.file)
	}
	if(message.data.action === "get-frame") {
		const frame = await getFrame(message.data.timestamp, message.data.effect_id)
		self.postMessage({action: "frame", frame})
		frame.close()
	}
})

function find_frame(timestamp: number, effect_id: string) {
	let to_remove = 0
	const frame = frames.find((frame, i) => {
		if(frame.timestamp === timestamp && frame.effect_id === effect_id) {
			to_remove = i
			return frame
		}
	})
	return {to_remove, frame}
}

function getFrame(timestamp: number, effect_id: string): Promise<VideoFrame> {
	return new Promise((resolve) => {
		const {frame, to_remove} = find_frame(timestamp, effect_id)
		if(frame) {
			resolve(frame.frame)
			frames.splice(to_remove, 1)
		} else {
			const interval = setInterval(() => {
				const {frame, to_remove} = find_frame(timestamp, effect_id)
				if(frame) {
					resolve(frame.frame)
					frames.splice(to_remove, 1)
					clearInterval(interval)
				}
			}, 100)
		}
	})
}
