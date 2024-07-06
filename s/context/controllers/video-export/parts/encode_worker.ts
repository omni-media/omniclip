import {BinaryAccumulator} from "../tools/BinaryAccumulator/tool.js"

let timebase = 25
const binary_accumulator = new BinaryAccumulator()

async function handle_chunk(chunk: EncodedVideoChunk) {
	let chunk_data = new Uint8Array(chunk.byteLength)
	chunk.copyTo(chunk_data)
	binary_accumulator.add_chunk(chunk_data)
	//@ts-ignore
	chunk_data = null
}

// for later: https://github.com/gpac/mp4box.js/issues/243
const config: VideoEncoderConfig = {
	codec: "avc1.640034", // avc1.42001E / avc1.4d002a / avc1.640034
	avc: {format: "annexb"},
	width: 1280,
	height: 720,
	bitrate: 9_000_000, // 9 Mbps
	framerate: timebase,
	bitrateMode: "constant"
}

const encoder = new VideoEncoder({
	output: handle_chunk,
	error: (e: any) => {
		console.log(e.message)
	},
})

encoder.addEventListener("dequeue", () => {
	self.postMessage({action: "dequeue", size: encoder.encodeQueueSize})
})

self.addEventListener("message", async message => {
	if(message.data.action === "configure") {
		config.bitrate = message.data.bitrate * 1000
		config.width = message.data.width
		config.height = message.data.height
		encoder.configure(config)
	}
	if(message.data.action === "encode") {
		const frame = message.data.frame as VideoFrame
		encoder.encode(frame)
		frame.close()
	}
	if(message.data.action === "get-binary") {
		await encoder.flush()
		self.postMessage({action: "binary", binary: binary_accumulator.binary})
	}
})
