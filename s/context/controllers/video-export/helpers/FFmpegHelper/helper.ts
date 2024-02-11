import {FFprobeWorker} from "ffprobe-wasm/browser.mjs"
import {FFmpeg} from "@ffmpeg/ffmpeg/dist/esm/index.js"
import {fetchFile} from "@ffmpeg/util/dist/esm/index.js"
import {toBlobURL} from "@ffmpeg/util/dist/esm/index.js"

export class FFmpegHelper {
	ffmpeg = new FFmpeg()
	ffprobe = new FFprobeWorker()

	constructor() {
		this.#load_ffmpeg().then(() => console.log("loaded"))
		this.ffmpeg.on("log", (log) => console.log(log))
	}

	async #load_ffmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.5/dist/esm'
		await this.ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL("https://unpkg.com/@ffmpeg/core-mt@0.12.5/dist/esm/ffmpeg-core.worker.js", "text/javascript")
		})
	}

	async mux(raw_cotainer_name: string, output_file_name: string) {
		//await this.#ffmpeg.exec(['-i', 'raw.h264','-map','0:v:0', '-c:v', 'copy', 'test.mp4']);
		await this.ffmpeg.exec(['-i', `${raw_cotainer_name}`, '-c:v', 'copy', `${output_file_name}`]);
	}

	async write_binary_into_container(binary: Uint8Array, container_name: string) {
		await this.ffmpeg.writeFile(`${container_name}`, binary)
	}
	
	async get_muxed_file() {
		return await this.ffmpeg.readFile("test.mp4") as Uint8Array
	}

	async get_frames_count(file: File) {
		const probe = await this.ffprobe.getFrames(file, 1)
		return probe.nb_frames
	}

	async* generate_video_effect_filmstrips(file: File): AsyncGenerator<string> {
		let segment_number = 0

		const result = await fetchFile(file)
		await this.ffmpeg.createDir("/thumbnails")
		await this.ffmpeg.createDir("/segments")
		await this.ffmpeg.writeFile(file.name, result)
		// split into 5 second segments, so user can get new filmstrips every 5 seconds
		await this.ffmpeg.exec(["-threads", "4","-i", file.name, "-c", "copy", "-map", "0", "-reset_timestamps", "1", "-f", "segment", "-segment_time", "5", "segments/out%d.mp4"])
		const segments = await this.ffmpeg.listDir("/segments")

		for(const segment of segments) {
			if(!segment.isDir) {
				await this.ffmpeg.exec(["-threads", "4","-i", `segments/${segment.name}`, "-filter_complex", `scale=100:50`, "-an", "-c:v", "libwebp", "-preset","icon" ,`thumbnails/${segment_number}_out%d.webp`])
				const frames = await this.ffmpeg.listDir("/thumbnails")
				for(const frame of frames) {
					if(!frame.isDir) {
						const frame_data = await this.ffmpeg.readFile(`thumbnails/${frame.name}`)
						yield URL.createObjectURL(new Blob([frame_data]))
						await this.ffmpeg.deleteFile(`thumbnails/${frame.name}`)
					}
				}
			}
			segment_number += 1
		}

		await this.ffmpeg.deleteDir("/thumbnails")
	}

}
