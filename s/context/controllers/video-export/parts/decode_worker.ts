import {wait} from "../../../../utils/wait.js"

let timestamp = 0
let start = 0
let end = 0
let id = ""

let timebase = 0
let timestamp_end = 0
let lastProcessedTimestamp = 0
let timebaseInMicroseconds = 1000/25 * 1000

const decoder = new VideoDecoder({
	output(frame) {
		const frameTimestamp = frame.timestamp / 1000
		if(frameTimestamp < start) {
			frame.close()
			return
		}

		processFrame(frame, timebaseInMicroseconds)
	},
	error: (e) => console.log(e)
})

const interval = setInterval(async()  => {
	if(timestamp >= timestamp_end) {
		await wait(5) // wait in case some more frames
		self.postMessage({action: "end"})
	}
}, 100)

decoder.addEventListener("dequeue", () => {
	self.postMessage({action: "dequeue", size: decoder.decodeQueueSize})
})

self.addEventListener("message", async message => {
	if(message.data.action === "demux") {
		timestamp = message.data.starting_timestamp
		timebase = message.data.timebase
		timebaseInMicroseconds = 1000/timebase * 1000
		start = message.data.props.start
		end = message.data.props.end
		id = message.data.props.id
		timestamp_end = (message.data.starting_timestamp) + (message.data.props.end - message.data.props.start)
	}
	if(message.data.action === "configure") {
		decoder.configure(message.data.config)
		await decoder.flush()
	}
	if(message.data.action === "chunk") {
		decoder.decode(message.data.chunk)
	}
})

/*
* -- processFrame --
* Function responsible for maintaining
* video framerate to desired timebase
*/

function processFrame(currentFrame: VideoFrame, targetFrameInterval: number) {
	if(lastProcessedTimestamp === 0) {
		self.postMessage({
				action: "new-frame",
				frame: {
					timestamp,
					frame: currentFrame,
					effect_id: id,
				}
		})
		timestamp += 1000 / timebase
		lastProcessedTimestamp += currentFrame.timestamp
	}

	// if met frame is duplicated
	while (currentFrame.timestamp >= lastProcessedTimestamp + targetFrameInterval) {
		self.postMessage({
				action: "new-frame",
				frame: {
					timestamp,
					frame: currentFrame,
					effect_id: id,
				}
		})

		timestamp += 1000 / timebase
		lastProcessedTimestamp += targetFrameInterval
	}
	
	// if not met frame is skipped
	if (currentFrame.timestamp >= lastProcessedTimestamp) {
		self.postMessage({
				action: "new-frame",
				frame: {
					timestamp,
					frame: currentFrame,
					effect_id: id,
				}
		})

		timestamp += 1000 / timebase
		lastProcessedTimestamp += targetFrameInterval
	}

	currentFrame.close()
}
