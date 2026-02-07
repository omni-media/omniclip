import {generate_id} from "@benev/slate/x/tools/generate_id.js"
import {Annotation, Point, DrawingToolType} from "../../../types.js"

/**
 * Base interface for all drawing tools
 * Each tool implements the strategy pattern for different drawing types
 */
export interface DrawingTool {
	type: DrawingToolType
	start(graphics: PIXI.Graphics, point: Point, color: string, strokeWidth: number): void
	update(graphics: PIXI.Graphics, point: Point): void
	end(graphics: PIXI.Graphics, point: Point): Annotation
}

/**
 * Freehand drawing tool - draws smooth curves following mouse/pointer movement
 */
export class FreehandTool implements DrawingTool {
	type: DrawingToolType = 'freehand'
	private points: Point[] = []
	private color: string = '#FF0000'
	private strokeWidth: number = 3
	private startTime: number = 0

	start(graphics: PIXI.Graphics, point: Point, color: string, strokeWidth: number): void {
		this.points = [point]
		this.color = color
		this.strokeWidth = strokeWidth
		this.startTime = Date.now()

		graphics.clear()
		//@ts-ignore - PIXI lineStyle compatibility
		graphics.lineStyle(strokeWidth, color, 1)
		graphics.moveTo(point.x, point.y)
	}

	update(graphics: PIXI.Graphics, point: Point): void {
		this.points.push(point)

		// Smooth curve rendering using quadratic curves
		if (this.points.length > 2) {
			const lastPoint = this.points[this.points.length - 2]
			const controlPoint = {
				x: (lastPoint.x + point.x) / 2,
				y: (lastPoint.y + point.y) / 2
			}
			graphics.quadraticCurveTo(lastPoint.x, lastPoint.y, controlPoint.x, controlPoint.y)
		} else {
			graphics.lineTo(point.x, point.y)
		}
	}

	end(graphics: PIXI.Graphics, point: Point): Annotation {
		this.points.push(point)

		return {
			id: generate_id(),
			type: this.type,
			coordinates: {
				path: [...this.points]
			},
			affectedEffects: [],  // Will be filled by DrawingManager
			color: this.color,
			strokeWidth: this.strokeWidth,
			drawnAtTimecode: this.startTime
		}
	}
}

/**
 * Arrow drawing tool - draws arrows from start to end point with arrowhead
 */
export class ArrowTool implements DrawingTool {
	type: DrawingToolType = 'arrow'
	private startPoint: Point | null = null
	private color: string = '#FF0000'
	private strokeWidth: number = 3
	private startTime: number = 0

	start(graphics: PIXI.Graphics, point: Point, color: string, strokeWidth: number): void {
		this.startPoint = point
		this.color = color
		this.strokeWidth = strokeWidth
		this.startTime = Date.now()

		graphics.clear()
	}

	update(graphics: PIXI.Graphics, point: Point): void {
		if (!this.startPoint) return

		graphics.clear()
		//@ts-ignore - PIXI lineStyle compatibility
		graphics.lineStyle(this.strokeWidth, this.color, 1)

		// Draw line
		graphics.moveTo(this.startPoint.x, this.startPoint.y)
		graphics.lineTo(point.x, point.y)

		// Draw arrowhead
		this.drawArrowhead(graphics, this.startPoint, point)
	}

	end(graphics: PIXI.Graphics, point: Point): Annotation {
		if (!this.startPoint) {
			throw new Error("Arrow tool not properly initialized")
		}

		const annotation: Annotation = {
			id: generate_id(),
			type: this.type,
			coordinates: {
				start: {...this.startPoint},
				end: {...point}
			},
			affectedEffects: [],  // Will be filled by DrawingManager
			color: this.color,
			strokeWidth: this.strokeWidth,
			drawnAtTimecode: this.startTime
		}

		this.startPoint = null
		return annotation
	}

	private drawArrowhead(graphics: PIXI.Graphics, start: Point, end: Point): void {
		const headLength = 15 + this.strokeWidth * 2
		const angle = Math.atan2(end.y - start.y, end.x - start.x)

		//@ts-ignore - PIXI lineStyle compatibility
		graphics.lineStyle(this.strokeWidth, this.color, 1)
		//@ts-ignore - PIXI beginFill compatibility
		graphics.beginFill(this.color)

		// Draw filled triangle arrowhead
		const arrowPoint1 = {
			x: end.x - headLength * Math.cos(angle - Math.PI / 6),
			y: end.y - headLength * Math.sin(angle - Math.PI / 6)
		}
		const arrowPoint2 = {
			x: end.x - headLength * Math.cos(angle + Math.PI / 6),
			y: end.y - headLength * Math.sin(angle + Math.PI / 6)
		}

		graphics.moveTo(end.x, end.y)
		graphics.lineTo(arrowPoint1.x, arrowPoint1.y)
		graphics.lineTo(arrowPoint2.x, arrowPoint2.y)
		graphics.lineTo(end.x, end.y)
		graphics.endFill()
	}
}

/**
 * Rectangle drawing tool - draws rectangles from corner to corner
 */
export class RectangleTool implements DrawingTool {
	type: DrawingToolType = 'rectangle'
	private startPoint: Point | null = null
	private color: string = '#FF0000'
	private strokeWidth: number = 3
	private startTime: number = 0

	start(graphics: PIXI.Graphics, point: Point, color: string, strokeWidth: number): void {
		this.startPoint = point
		this.color = color
		this.strokeWidth = strokeWidth
		this.startTime = Date.now()

		graphics.clear()
	}

	update(graphics: PIXI.Graphics, point: Point): void {
		if (!this.startPoint) return

		graphics.clear()
		//@ts-ignore - PIXI lineStyle compatibility
		graphics.lineStyle(this.strokeWidth, this.color, 1)

		const width = point.x - this.startPoint.x
		const height = point.y - this.startPoint.y

		graphics.drawRect(this.startPoint.x, this.startPoint.y, width, height)
	}

	end(graphics: PIXI.Graphics, point: Point): Annotation {
		if (!this.startPoint) {
			throw new Error("Rectangle tool not properly initialized")
		}

		const annotation: Annotation = {
			id: generate_id(),
			type: this.type,
			coordinates: {
				start: {...this.startPoint},
				end: {...point}
			},
			affectedEffects: [],  // Will be filled by DrawingManager
			color: this.color,
			strokeWidth: this.strokeWidth,
			drawnAtTimecode: this.startTime
		}

		this.startPoint = null
		return annotation
	}
}

/**
 * Circle drawing tool - draws circles from center outward
 */
export class CircleTool implements DrawingTool {
	type: DrawingToolType = 'circle'
	private centerPoint: Point | null = null
	private color: string = '#FF0000'
	private strokeWidth: number = 3
	private startTime: number = 0

	start(graphics: PIXI.Graphics, point: Point, color: string, strokeWidth: number): void {
		this.centerPoint = point
		this.color = color
		this.strokeWidth = strokeWidth
		this.startTime = Date.now()

		graphics.clear()
	}

	update(graphics: PIXI.Graphics, point: Point): void {
		if (!this.centerPoint) return

		graphics.clear()
		//@ts-ignore - PIXI lineStyle compatibility
		graphics.lineStyle(this.strokeWidth, this.color, 1)

		const radius = Math.sqrt(
			Math.pow(point.x - this.centerPoint.x, 2) +
			Math.pow(point.y - this.centerPoint.y, 2)
		)

		graphics.drawCircle(this.centerPoint.x, this.centerPoint.y, radius)
	}

	end(graphics: PIXI.Graphics, point: Point): Annotation {
		if (!this.centerPoint) {
			throw new Error("Circle tool not properly initialized")
		}

		const radius = Math.sqrt(
			Math.pow(point.x - this.centerPoint.x, 2) +
			Math.pow(point.y - this.centerPoint.y, 2)
		)

		const annotation: Annotation = {
			id: generate_id(),
			type: this.type,
			coordinates: {
				center: {...this.centerPoint},
				radius
			},
			affectedEffects: [],  // Will be filled by DrawingManager
			color: this.color,
			strokeWidth: this.strokeWidth,
			drawnAtTimecode: this.startTime
		}

		this.centerPoint = null
		return annotation
	}
}

/**
 * Factory function to create the appropriate tool based on type
 */
export function createDrawingTool(type: DrawingToolType): DrawingTool {
	switch (type) {
		case 'freehand':
			return new FreehandTool()
		case 'arrow':
			return new ArrowTool()
		case 'rectangle':
			return new RectangleTool()
		case 'circle':
			return new CircleTool()
		default:
			throw new Error(`Unknown drawing tool type: ${type}`)
	}
}
