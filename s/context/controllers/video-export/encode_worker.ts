import {BinaryAccumulator} from "./tools/BinaryAccumulator/tool.js"

const timebase = 25 // hardcoded timebase
const binary_accumulator = new BinaryAccumulator()

async function handleChunk(chunk: EncodedVideoChunk) {
	const chunkData = new Uint8Array(chunk.byteLength);
	chunk.copyTo(chunkData)
	binary_accumulator.addChunk(chunkData)
}

// for later: https://github.com/gpac/mp4box.js/issues/243
const config: VideoEncoderConfig = {
	codec: "avc1.4d002a", // avc1.42001E / avc1.4d002a / avc1.640034
	avc: {format: "annexb"},
	width: 1280,
	height: 720,
	bitrate: 4_000_000, // 2 Mbps
	framerate: timebase,
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
		await encoder.flush()
		self.postMessage({action: "binary", binary: binary_accumulator.binary})
	}
})
