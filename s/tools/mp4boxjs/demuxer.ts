import { WebDemuxer } from "web-demuxer/dist/web-demuxer.js"

const webdemuxer = new WebDemuxer({
  // ⚠️ you need to put the dist/wasm-files file in the npm package into a static directory like public
  // making sure that the js and wasm in wasm-files are in the same directory
  wasmLoaderPath: "https://cdn.jsdelivr.net/npm/web-demuxer@latest/dist/wasm-files/ffmpeg.min.js",
})

export async function demuxer(
	file: File,
	worker: Worker,
	onConfig: (config: VideoDecoderConfig) => void,
	onChunk: (chunk: EncodedVideoChunk) => void
) {
  await webdemuxer.load(file)
	const config = await webdemuxer.getVideoDecoderConfig()
	onConfig(config)
    const reader = webdemuxer.readAVPacket().getReader()
		let readed = 0
		let queue = 0
		worker.addEventListener("message", (msg) => {
			if(msg.data.action === "dequeue") {
				queue = msg.data.size
			}
		})
    reader.read().then(async function processAVPacket({ done, value }): Promise<any> {
      if (done) {
        return undefined
      }

		// await new Promise((resolve) => {
		// 	if(queue <= 10) {
		// 		resolve(true)
		// 	} else {
		// 		const interval = setInterval(() => {
		// 			if(queue <= 10) {
		// 				resolve(true)
		// 				clearInterval(interval)
		// 			}
		// 		}, 1)
		// 	}
		// })
      // videoPackets.push(value) // get one video packet
      // and you can generate video chunk for video decoder
      const videoChunk = webdemuxer.genEncodedVideoChunk(value)
			onChunk(videoChunk)
			readed += 1
			// await delay(7)
			// console.log("CHUNK")
      return reader.read().then(processAVPacket)
  })
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

