import { WebDemuxer } from "web-demuxer/dist/web-demuxer.js"

export async function demuxer(
	file: File,
	worker: Worker,
	onConfig: (config: VideoDecoderConfig) => void,
	onChunk: (chunk: EncodedVideoChunk) => void
) {
	let queue = 0
	const webdemuxer = new WebDemuxer({
		// ⚠️ you need to put the dist/wasm-files file in the npm package into a static directory like public
		// making sure that the js and wasm in wasm-files are in the same directory
		wasmLoaderPath: "https://cdn.jsdelivr.net/npm/web-demuxer@latest/dist/wasm-files/ffmpeg.min.js",
	})
	await webdemuxer.load(file)
	const config = await webdemuxer.getVideoDecoderConfig()
	onConfig(config)
	const reader = webdemuxer.readAVPacket().getReader()
	worker.addEventListener("message", (msg) => {
		if(msg.data.action === "dequeue") {
			queue = msg.data.size
		}
	})
	reader.read().then(async function processAVPacket({ done, value }): Promise<any> {
		if (done) {return}
		const delay = calculateDynamicDelay(queue)
		await sleep(delay)
		const videoChunk = webdemuxer.genEncodedVideoChunk(value)
		onChunk(videoChunk)
		return reader.read().then(processAVPacket)
	})
}

 function calculateDynamicDelay(queueSize: number) {
		const queueLimit = 500
		const maxDelay = 100 // Maximum delay in milliseconds
		const minDelay = 0   // Minimum delay in milliseconds
		const delay = (queueSize / queueLimit) * maxDelay;
		return Math.min(maxDelay, Math.max(minDelay, delay));
	}

	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

