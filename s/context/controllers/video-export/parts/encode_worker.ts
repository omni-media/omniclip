import {BinaryAccumulator} from "../../video-export/tools/BinaryAccumulator/tool.js"

const binary_accumulator = new BinaryAccumulator()
let getChunks = false

async function handle_chunk(chunk: EncodedVideoChunk) {
	let chunk_data = new Uint8Array(chunk.byteLength)
	chunk.copyTo(chunk_data)
	binary_accumulator.add_chunk(chunk_data)

	if(getChunks)
		self.postMessage({
			action: "chunk",
			chunk: chunk_data
		})

	//@ts-ignore
	chunk_data = null
}

// for later: https://github.com/gpac/mp4box.js/issues/243
const config: VideoEncoderConfig = {
	codec: "avc1.640034",
	avc: {format: "annexb"},
	width: 1280,
	height: 720,
	bitrate: 9_000_000, // 9 Mbps
	framerate: 60,
	bitrateMode: "quantizer" // add variable option to ui
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
		config.framerate = message.data.timebase
		config.bitrateMode = message.data.bitrateMode ?? "constant"
		getChunks = message.data.getChunks
		encoder.configure(config)
	}
	if(message.data.action === "encode") {
		const frame = message.data.frame as VideoFrame
		if(config.bitrateMode === "quantizer") {
			// @ts-ignore
			encoder.encode(frame, {avc: {quantizer: 35}})
		} else {
			encoder.encode(frame)
		}
		frame.close()
	}
	if(message.data.action === "get-binary") {
		await encoder.flush()
		self.postMessage({action: "binary", binary: binary_accumulator.binary})
	}
})

// some codecs
// codec: "av01.0.08M.08", // avc1.42001E / avc1.4d002a / avc1.640034
// codec: "vp09.02.60.10.01.09.09.1",
// avc1.42001E / avc1.4d002a / avc1.640034
//"av01.0.08M.08"
