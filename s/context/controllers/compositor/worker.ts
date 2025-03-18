// import {TextEffect} from "../../types.js"

// let offscreen_canvas: OffscreenCanvas | undefined = undefined
// let ctx: OffscreenCanvasRenderingContext2D | null = null

// function start({canvas}: {canvas: OffscreenCanvas}) {
// 	offscreen_canvas = canvas
// 	ctx = canvas.getContext("2d")
// 	offscreen_canvas!.width = 1280
// 	offscreen_canvas!.height = 720
// }

// function draw_text(source: TextEffect) {
// 	const {size, color, content} = source
// 	ctx!.fillStyle = color
// 	ctx!.font = `bold ${size * 5}px sans-serif`
// 	ctx!.fillText(content, offscreen_canvas!.width / 2, offscreen_canvas!.height / 2)
// }

// function draw_video_frame(frame: VideoFrame) {
// 	ctx!.drawImage(
// 		frame,
// 		0,
// 		0,
// 		offscreen_canvas!.width,
// 		offscreen_canvas!.height
// 	)
// 	self.postMessage(frame)
// 	frame.close()
// }

// function clear_canvas() {
// 	ctx?.clearRect(0, 0, 1280, 720)
// }

// self.addEventListener("message", message => {
// 	if(message.data.type === "frame") {
// 		draw_video_frame(message.data.frame)
// 	}
// 	if(message.data.type === "text") {
// 		draw_text(message.data.item)
// 	}
// 	if(message.data.type === "canvas") {
// 		start(message.data)
// 	}
// 	if(message.data.type === "clear-canvas") {
// 		clear_canvas()
// 	}
// })
