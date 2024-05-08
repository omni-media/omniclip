import {Status} from "../../../../context/types.js"
import {Canvas2DRenderer} from "./utils/renderer_2d.js"

const decoder = new VideoDecoder({
	output(frame) {
		if (startTime == null) {
			startTime = performance.now()
		} else {
			const elapsed = (performance.now() - startTime) / 1000
			const fps = ++frameCount / elapsed
			setStatus("render", `${fps.toFixed(0)} fps`)
		}
		renderFrame(frame)
	},
	error(e) {
		setStatus("decode", e)
	}
})

let pendingStatus: null | any = null
const setStatus = (type: Status, message: DOMException | string) => {
	if (pendingStatus) {
		pendingStatus[type] = message
	} else {
		pendingStatus = {[type]: message}
		self.requestAnimationFrame(statusAnimationFrame)
	}
}

const statusAnimationFrame = () => {
	self.postMessage(pendingStatus)
	pendingStatus = null
}

let renderer: null | Canvas2DRenderer = null
let pendingFrame: VideoFrame | null = null
let startTime: null | number = null
let frameCount = 0

const renderFrame = (frame: VideoFrame) => {
	if (!pendingFrame) {
		requestAnimationFrame(renderAnimationFrame)
	} else {
		pendingFrame.close()
	}
	pendingFrame = frame
}

const renderAnimationFrame = () => {
	renderer?.draw(pendingFrame!)
	pendingFrame = null
}

const start = ({dataUri, rendererName, canvas}: {dataUri: string, rendererName: string, canvas: HTMLCanvasElement}) => {
	switch (rendererName) {
		case "2d":
			renderer = new Canvas2DRenderer(canvas);
			break
		case "webgl":
			//renderer = new WebGLRenderer(rendererName, canvas);
			break
		case "webgl2":
			break
		//renderer = new WebGLRenderer(rendererName, canvas);
		case "webgpu":
			//renderer = new WebGPURenderer(canvas);
			break
	}

}

self.addEventListener("message", message => start(message.data), {once: true})
