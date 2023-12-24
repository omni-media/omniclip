import {FFmpeg} from "@ffmpeg/ffmpeg/dist/esm/index.js"
import {toBlobURL} from "@ffmpeg/util/dist/esm/index.js"

export class FFmpegHelper {
	#ffmpeg = new FFmpeg()

	constructor() {
		this.#load_ffmpeg().then(() => console.log("loaded"))
	}

	async #load_ffmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.5/dist/esm'
		await this.#ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL("https://unpkg.com/@ffmpeg/core-mt@0.12.5/dist/esm/ffmpeg-core.worker.js", "text/javascript")
		})
	}
	
	async mux(raw_cotainer_name: string, output_file_name: string) {
		//await this.#ffmpeg.exec(['-i', 'raw.h264','-map','0:v:0', '-c:v', 'copy', 'test.mp4']);
		await this.#ffmpeg.exec(['-i', `${raw_cotainer_name}`, '-c:v', 'copy', `${output_file_name}`]);
	}

	async write_binary_into_container(binary: Uint8Array, container_name: string) {
		await this.#ffmpeg.writeFile(`${container_name}`, binary)
	}
	
	async get_muxed_file() {
		return await this.#ffmpeg.readFile("test.mp4") as Uint8Array
	}
}
