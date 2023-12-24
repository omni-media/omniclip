import {XClip} from "../../types.js"
import {MP4Demuxer} from "../MP4Demuxer/tool.js"
import {BinaryAccumulator} from "../BinaryAccumulator/tool.js"

const binary_accumulator = new BinaryAccumulator()

async function export_start(clips: XClip[]) {
	console.log("export")
	clips.forEach(clip => {
		if(clip.item.type === "Video") {
			demuxer(new URL("../../bbb_video_avc_frag.mp4", import.meta.url).toString())
		}
	})
}

const demuxer = (url: string) =>
	new MP4Demuxer(url, {
		onConfig(config: VideoDecoderConfig) {
			decoder.configure(config)
		},
		onChunk(chunk: EncodedVideoChunk) {
			decoder.decode(chunk)
		},
		setStatus: () => {}
})

async function handleChunk(chunk: EncodedVideoChunk) {
	const chunkData = new Uint8Array(chunk.byteLength);
	chunk.copyTo(chunkData)
	binary_accumulator.addChunk(chunkData)
	if(decoder.decodeQueueSize === 0) {
		self.postMessage({chunks: binary_accumulator.binary, type: "export-end"})
	}
}
// for later: https://github.com/gpac/mp4box.js/issues/243
const config: VideoEncoderConfig = {
	codec: "avc1.4d002a", // or avc1.42001E
	avc: {format: "annexb"},
	width: 640,
	height: 480,
	bitrate: 2_000_000, // 2 Mbps
	framerate: 30,
}

const encoder = new VideoEncoder({
	output: handleChunk,
	error: (e: any) => {
		console.log(e.message)
	},
})

encoder.configure(config)

const decoder = new VideoDecoder({
	output(frame) {
		encoder.encode(frame)
		frame.close()
	},
	error: (e) => console.log(e) 
})

self.addEventListener("message", message => {
	export_start(message.data.clips)
})
