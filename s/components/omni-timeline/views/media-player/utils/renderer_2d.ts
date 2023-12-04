export class Canvas2DRenderer {
	#canvas: HTMLCanvasElement
	#ctx: CanvasRenderingContext2D

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas
		this.#ctx = canvas.getContext("2d")!
	}

	draw(frame: VideoFrame) {
		this.#canvas.width = frame.displayWidth
		this.#canvas.height = frame.displayHeight
		this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight)
		frame.close()
	}
}
