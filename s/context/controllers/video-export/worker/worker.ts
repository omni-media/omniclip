import {MP4Demuxer} from "./tools/MP4Demuxer/tool.js"
import {AnyEffect, TextEffect} from "../../timeline/types.js"
import {BinaryAccumulator} from "./tools/BinaryAccumulator/tool.js"
import {get_effects_at_timestamp} from "./utils/get_effects_at_timestamp.js"

let demux_started = false
let decoded_chunks = 0
let chunks_to_decode: EncodedVideoChunk[] = []
const binary_accumulator = new BinaryAccumulator()

let timestamp = 0
let timestamp_end: number
let exported_frame: VideoFrame | null = null
let current_frame: VideoFrame | null = null

let canvas: OffscreenCanvas
let ctx: OffscreenCanvasRenderingContext2D

async function export_start(effects: AnyEffect[], offscreen_canvas: OffscreenCanvas) {
	canvas = offscreen_canvas
	ctx = canvas.getContext("2d")!
	canvas.width = 1280
	canvas.height = 720
	timestamp_end = Math.max(...effects.map(effect => effect.start_at_position + effect.duration))
	export_process(effects)
}

async function export_process(effects: AnyEffect[]) {
	const progress = timestamp / timestamp_end * 100 // for progress bar
	self.postMessage({progress: progress, type: "progress"})

	const effects_at_timestamp = get_effects_at_timestamp(effects, timestamp)
	if(effects_at_timestamp) {

		const frame_config: VideoFrameInit = {
			displayWidth: canvas.width,
			displayHeight: canvas.height,
			duration: 1000000/30,
			timestamp: timestamp * 1000
		}

		for(const effect of effects_at_timestamp) {
			if(effect.kind === "video") {
				if(!demux_started) {
					demux_started = true
					demuxer(new URL("./bbb_video_avc_frag.mp4", import.meta.url).toString())
				} else if(chunks_to_decode.length > 0) {
					decoder.decode(chunks_to_decode[decoded_chunks])
					decoded_chunks += 1
					if(current_frame && current_frame !== exported_frame) {
						ctx?.drawImage(current_frame, current_frame.codedRect!.x, current_frame.codedRect!.y, canvas.width, canvas.height)
						timestamp += 1000/30
					}
					if(decoded_chunks === chunks_to_decode.length) {
						chunks_to_decode = []
						demux_started = false
					}
				}
			}
			if(effect.kind === "text") {
				if(current_frame && current_frame !== exported_frame) {
					draw_text(effect, ctx!)
					timestamp += 1000/30
				} else if (!current_frame) {
					draw_text(effect, ctx!)
					timestamp += 1000/30
				}
			}
		}
		if(current_frame && current_frame !== exported_frame) {
			const edited_frame = new VideoFrame(canvas, frame_config)
			encoder.encode(edited_frame)
			edited_frame.close()

			current_frame.close()
			current_frame = null
			exported_frame = current_frame

		} else if(!current_frame) {
			const edited_frame = new VideoFrame(canvas, frame_config)
			encoder.encode(edited_frame)
			edited_frame.close()
		}
	} else if(timestamp <= timestamp_end) {
		draw_blank_canvas()
		timestamp += 1000/30
	}
	requestAnimationFrame(() => export_process(effects))
}

function draw_blank_canvas() {
	const canvas = new OffscreenCanvas(720, 1280)
	const ctx = canvas.getContext("2d")
	ctx!.fillStyle = "blue";
	ctx!.fillRect(0, 0, canvas.width, canvas.height);
}

const demuxer = (url: string) =>
	new MP4Demuxer(url, {
		async onConfig(config: VideoDecoderConfig) {
			decoder.configure(config)
			await decoder.flush()
		},
		onChunk(chunk: EncodedVideoChunk) {
			chunks_to_decode.push(chunk)
		}
	}
)

async function handleChunk(chunk: EncodedVideoChunk) {
	const chunkData = new Uint8Array(chunk.byteLength);
	chunk.copyTo(chunkData)
	binary_accumulator.addChunk(chunkData)
	console.log(timestamp, timestamp_end)
	if(timestamp >= timestamp_end) {
		console.log("end")
		self.postMessage({chunks: binary_accumulator.binary, type: "export-end"})
	}
}

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

const decoder = new VideoDecoder({
	output(frame) {
		current_frame = frame
	},
	error: (e) => console.log(e)
})

self.addEventListener("message", message => {
	export_start(message.data.effects, message.data.canvas)
})

function draw_text(source: TextEffect, ctx: OffscreenCanvasRenderingContext2D) {
	const {size, color, content} = source
	ctx.fillStyle = color
	ctx.font = `bold ${size * 5}px sans-serif`
	ctx.fillText(content, ctx.canvas!.width / 2, ctx.canvas!.height / 2)
}
