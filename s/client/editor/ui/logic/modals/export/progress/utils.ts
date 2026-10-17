
import {ExportResult} from "../constants.js"
import {ExportConfig} from "@omnimedia/omnitool"

export const toOmnitoolExportConfig = (
	settings: ExportResult,
	framerate: number,
): ExportConfig => {
	framerate = Number(framerate)
	if (!Number.isFinite(framerate) || framerate <= 0)
		throw new RangeError(`Invalid export frame rate: ${framerate}`)

	return {
		container: settings.format,
		framerate,
		video: {
			codec: settings.codec === "h264" ? "avc" : settings.codec,
			bitrate: settings.bitrate * 1000,
		},
	}
}

export function copyFrame(src: HTMLCanvasElement, dst: HTMLCanvasElement) {
	if (dst.width !== src.width) dst.width = src.width
	if (dst.height !== src.height) dst.height = src.height
	dst.getContext("2d")?.drawImage(src, 0, 0)
}
