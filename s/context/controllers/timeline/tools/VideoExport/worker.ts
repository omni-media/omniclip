import {XClip} from "../../types.js"
import {Text as XText} from "../../types.js"
import {MP4Demuxer} from "../MP4Demuxer/tool.js"
import {BinaryAccumulator} from "../BinaryAccumulator/tool.js"

let demux_started = false
let decoded_chunks = 0
let chunks_to_decode: EncodedVideoChunk[] = []
const binary_accumulator = new BinaryAccumulator()

let timestamp = 0
let timestamp_end: number
let current_frame: VideoFrame | null = null

async function export_start(clips: XClip[]) {
	console.log("export")
	timestamp_end = Math.max(...clips.map(clip => clip.start_at_position + clip.duration))
	export_process(clips)
}

function sort_clips_by_track(clips: XClip[]) {
	// so that clips on first track draw on top of things that are on second track
	const sorted_clips = clips.sort((a, b) => {
		if(a.track < b.track) return 1
			else return -1
	})
	return sorted_clips
}

function get_clips_at_timestamp(clips: XClip[], timestamp: number) {
	const filtered_clips = clips.filter(clip => clip.start_at_position <= timestamp && clip.start_at_position + clip.duration >= timestamp)
	const sorted_by_track = sort_clips_by_track(filtered_clips)
	return sorted_by_track.length > 0 ? sorted_by_track : undefined
}

async function export_process(clips: XClip[]) {
	const progress = timestamp / timestamp_end * 100 // for progress bar

	const clips_at_timestamp = get_clips_at_timestamp(clips, timestamp)
	if(clips_at_timestamp) {
		const canvas = new OffscreenCanvas(640, 480)
		const ctx = canvas.getContext("2d")
		const frame_config: VideoFrameInit = {
			displayWidth: canvas.width,
			displayHeight: canvas.height,
			duration: 33333,
			timestamp: timestamp * 1000
		}
		for(const clip of clips_at_timestamp) {
			if(clip.item.type === "Video") {
				if(!demux_started) {
					demux_started = true
					demuxer(new URL("../../bbb_video_avc_frag.mp4", import.meta.url).toString())
				} else if(chunks_to_decode.length > 0) {
					decoder.decode(chunks_to_decode[decoded_chunks])
					// here decoder needs to be flushed, wait for current frame otherwise sometimes frame is lost
					decoded_chunks += 1
					if(current_frame) {
						ctx?.drawImage(current_frame, current_frame.codedRect!.x, current_frame.codedRect!.y, current_frame.displayWidth, current_frame.displayHeight)
					}
					if(decoded_chunks === chunks_to_decode.length) {
						chunks_to_decode = []
						demux_started = false
					}
				}
			}
			if(clip.item.type === "Text") {
				draw_text(clip.item, ctx!)
			}
		}
		const edited_frame = new VideoFrame(canvas, frame_config)
		encoder.encode(edited_frame)
		edited_frame.close()
		if(current_frame) {
			current_frame.close()
			current_frame = null
		}
		timestamp += 33.33333
	} else if(timestamp <= timestamp_end) {
		const frame = draw_blank_canvas()
		encoder.encode(frame)
		timestamp += 33.33333
		frame.close()
	}
	requestAnimationFrame(() => export_process(clips))
}

function draw_blank_canvas() {
	const canvas = new OffscreenCanvas(1920, 1080)
	const ctx = canvas.getContext("2d")
	const frame_config: VideoFrameInit = {
		displayWidth: canvas.width,
		displayHeight: canvas.height,
		duration: 33.333,
		timestamp: timestamp * 1000
	}
	ctx!.fillStyle = "blue";
	ctx!.fillRect(0, 0, canvas.width, canvas.height);
	return new VideoFrame(canvas, frame_config)
}

const demuxer = (url: string) =>
	new MP4Demuxer(url, {
		async onConfig(config: VideoDecoderConfig) {
			decoder.configure(config)
			await decoder.flush()
		},
		onChunk(chunk: EncodedVideoChunk) {
			chunks_to_decode.push(chunk)
			// decoder.decode(chunk)
		},
		setStatus: () => {}
	}
)

async function handleChunk(chunk: EncodedVideoChunk) {
	const chunkData = new Uint8Array(chunk.byteLength);
	chunk.copyTo(chunkData)
	binary_accumulator.addChunk(chunkData)
	if(timestamp >= timestamp_end) {
		console.log("end")
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
		current_frame = frame
	},
	error: (e) => console.log(e)
})

self.addEventListener("message", message => {
	export_start(message.data.clips)
})

function draw_text(source: XText, ctx: OffscreenCanvasRenderingContext2D) {
	const {size, color, content} = source
	ctx.fillStyle = color
	ctx.font = `bold ${size * 5}px sans-serif`
	ctx.fillText(content, ctx.canvas!.width / 2, ctx.canvas!.height / 2)
}

// function get_overlapping_clips(clip: XClip, clips: XClip[]): Overlapping[] {
// 	let overlapping: Overlapping[] = []
// 	const excluded = clips.filter(c => c.id !== clip.id)

// 	excluded.forEach((c) => {
// 		const from = Math.max(clip.start_at_position, c.start_at_position)
// 		const to = Math.min(clip.start_at_position + clip.duration, c.start_at_position + c.duration)
// 		if(from <= to)
// 			overlapping.push({clip, between: [from, to]})
// 	})

// 	return overlapping
// }
//
// interface Overlapping {
// 	clip: XClip
// 	between: V2
// }
