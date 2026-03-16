
import {Ms} from '@omnimedia/omnitool/x/units/ms.js'

import {formatTime} from "../../../../../../utils/format-time.js"

export function drawMajorTick(ctx: CanvasRenderingContext2D, x: number, time: Ms) {
	ctx.fillStyle = "#444"
	ctx.fillRect(x, 0, 1, 32)
	ctx.fillStyle = "#888"
	ctx.fillText(formatTime(time), x + 4, 14)
}

