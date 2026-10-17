
export async function blobToFrame(blob: Blob) {
	const bitmap = await createImageBitmap(blob)
	try {
		return new VideoFrame(bitmap, {timestamp: 0})
	}
	finally {
		bitmap.close()
	}
}

export async function frameToPng(canvas: HTMLCanvasElement, frame: VideoFrame) {
	canvas.width = frame.displayWidth
	canvas.height = frame.displayHeight
	const ctx = canvas.getContext("2d")
	ctx?.drawImage(frame, 0, 0)
	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			blob => blob ? resolve(blob) : reject(new Error("Could not encode transparent image.")),
			"image/png"
		)
	})
}
