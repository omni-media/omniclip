import {Actions} from "../../../actions.js"
import {omnislate} from "../../../context.js"
import {Annotation, AnyEffect, Point, DrawingToolType, State} from "../../../types.js"
import {createDrawingTool, DrawingTool} from "./drawing-tools.js"
import type {Compositor} from "../controller.js"
import type {FederatedPointerEvent} from "pixi.js"

/**
 * DrawingManager - Manages the drawing overlay layer on the Pixi canvas
 *
 * Responsibilities:
 * - Manages the annotation layer (PIXI.Container) above all effects
 * - Handles pointer events for drawing when draw mode is enabled
 * - Renders annotations from state
 * - Detects which effect/track is under a drawing (for AI context)
 * - Provides API for Member 4 to consume annotation data
 */
export class DrawingManager {
	private annotationLayer: PIXI.Container
	private currentDrawingGraphics: PIXI.Graphics | null = null
	private currentTool: DrawingTool | null = null
	private isDrawing: boolean = false
	private canvasCoordOffset: Point = {x: 0, y: 0}

	// Store annotations rendered on canvas (keyed by annotation id)
	private renderedAnnotations: Map<string, PIXI.Graphics> = new Map()

	constructor(
		private compositor: Compositor,
		private actions: Actions
	) {
		this.annotationLayer = new PIXI.Container()
		this.annotationLayer.name = 'annotation-layer'
		this.annotationLayer.zIndex = 10000 // Top layer, above all effects
		this.annotationLayer.eventMode = 'none' // Don't block pointer events

		this.compositor.app.stage.sortableChildren = true
		//@ts-ignore - PIXI type compatibility
		this.compositor.app.stage.addChild(this.annotationLayer)

		this.setupPointerEvents()
	}

	/**
	 * Set up pointer event handlers for drawing
	 * These events are active only when drawing mode is enabled
	 */
	private setupPointerEvents(): void {
		//@ts-ignore - PIXI event type compatibility
		this.compositor.app.stage.on('pointerdown', this.onPointerDown.bind(this))
		//@ts-ignore - PIXI event type compatibility
		this.compositor.app.stage.on('pointermove', this.onPointerMove.bind(this))
		//@ts-ignore - PIXI event type compatibility
		this.compositor.app.stage.on('pointerup', this.onPointerUp.bind(this))
		//@ts-ignore - PIXI event type compatibility
		this.compositor.app.stage.on('pointerupoutside', this.onPointerUp.bind(this))
	}

	/**
	 * Handle pointer down - start drawing
	 */
	private onPointerDown(event: PIXI.FederatedPointerEvent): void {
		const state = this.getState()

		// Only handle drawing if draw mode is enabled
		if (!state.drawing_mode.enabled) return

		// Prevent default canvas interactions
		event.stopPropagation()

		const point = this.getCanvasPoint(event)
		this.startDrawing(point, state)
	}

	/**
	 * Handle pointer move - continue drawing
	 */
	private onPointerMove(event: PIXI.FederatedPointerEvent): void {
		const state = this.getState()

		if (!state.drawing_mode.enabled || !this.isDrawing) return

		const point = this.getCanvasPoint(event)
		this.updateDrawing(point)
	}

	/**
	 * Handle pointer up - finish drawing
	 */
	private onPointerUp(event: PIXI.FederatedPointerEvent): void {
		const state = this.getState()

		if (!state.drawing_mode.enabled || !this.isDrawing) return

		event.stopPropagation()

		const point = this.getCanvasPoint(event)
		this.endDrawing(point)
	}

	/**
	 * Get canvas coordinates from pointer event
	 */
	private getCanvasPoint(event: PIXI.FederatedPointerEvent): Point {
		return {
			x: event.global.x,
			y: event.global.y
		}
	}

	/**
	 * Start a new drawing stroke
	 */
	private startDrawing(point: Point, state: State): void {
		const {tool, color, strokeWidth} = state.drawing_mode

		// Create new graphics object for this drawing
		this.currentDrawingGraphics = new PIXI.Graphics()
		this.currentDrawingGraphics.eventMode = 'none'
		//@ts-ignore - PIXI type compatibility
		this.annotationLayer.addChild(this.currentDrawingGraphics)

		// Create tool instance
		this.currentTool = createDrawingTool(tool)
		this.currentTool.start(this.currentDrawingGraphics, point, color, strokeWidth)

		this.isDrawing = true
	}

	/**
	 * Update the current drawing stroke
	 */
	private updateDrawing(point: Point): void {
		if (!this.currentTool || !this.currentDrawingGraphics) return

		this.currentTool.update(this.currentDrawingGraphics, point)
	}

	/**
	 * Finish the current drawing stroke and save as annotation
	 */
	private endDrawing(point: Point): void {
		if (!this.currentTool || !this.currentDrawingGraphics) {
			this.isDrawing = false
			return
		}

		try {
			// Complete the drawing and get annotation data
			const annotation = this.currentTool.end(this.currentDrawingGraphics, point)

			// Detect which effects this annotation overlaps
			const state = this.getState()
			annotation.affectedEffects = this.detectAffectedEffects(annotation)
			annotation.drawnAtTimecode = state.timecode

			// Save annotation to state
			this.actions.add_annotation(annotation)

			// Store reference for future updates
			this.renderedAnnotations.set(annotation.id, this.currentDrawingGraphics)

		} catch (error) {
			console.error('Error completing drawing:', error)
			// Remove incomplete drawing
			if (this.currentDrawingGraphics) {
				this.annotationLayer.removeChild(this.currentDrawingGraphics)
				this.currentDrawingGraphics.destroy()
			}
		}

		this.currentDrawingGraphics = null
		this.currentTool = null
		this.isDrawing = false
	}

	/**
	 * Detect which effects this annotation overlaps (for AI context)
	 * Returns array of effect IDs that intersect with the annotation
	 */
	private detectAffectedEffects(annotation: Annotation): string[] {
		const state = this.getState()
		const effects = this.compositor.get_effects_relative_to_timecode(
			state.effects,
			state.timecode
		)

		// Get annotation bounds
		const bounds = this.getAnnotationBounds(annotation)
		if (!bounds) return []

		// Find all effects that intersect with the annotation
		const intersectingEffects = effects
			.filter(effect => effect.kind !== 'audio')
			.filter(effect => {
				const effectBounds = this.getEffectBounds(effect)
				return effectBounds && this.boundsIntersect(bounds, effectBounds)
			})

		// Return array of effect IDs, sorted by track (topmost first)
		return intersectingEffects
			.sort((a, b) => a.track - b.track)
			.map(effect => effect.id)
	}

	/**
	 * Get bounding box for an annotation
	 */
	private getAnnotationBounds(annotation: Annotation): {x: number, y: number, width: number, height: number} | null {
		const {coordinates} = annotation

		switch (annotation.type) {
			case 'freehand':
				if (!coordinates.path || coordinates.path.length === 0) return null
				const xs = coordinates.path.map(p => p.x)
				const ys = coordinates.path.map(p => p.y)
				const minX = Math.min(...xs)
				const maxX = Math.max(...xs)
				const minY = Math.min(...ys)
				const maxY = Math.max(...ys)
				return {x: minX, y: minY, width: maxX - minX, height: maxY - minY}

			case 'arrow':
			case 'rectangle':
				if (!coordinates.start || !coordinates.end) return null
				const x = Math.min(coordinates.start.x, coordinates.end.x)
				const y = Math.min(coordinates.start.y, coordinates.end.y)
				const width = Math.abs(coordinates.end.x - coordinates.start.x)
				const height = Math.abs(coordinates.end.y - coordinates.start.y)
				return {x, y, width, height}

			case 'circle':
				if (!coordinates.center || !coordinates.radius) return null
				return {
					x: coordinates.center.x - coordinates.radius,
					y: coordinates.center.y - coordinates.radius,
					width: coordinates.radius * 2,
					height: coordinates.radius * 2
				}

			default:
				return null
		}
	}

	/**
	 * Get bounding box for an effect on canvas
	 */
	private getEffectBounds(effect: AnyEffect): {x: number, y: number, width: number, height: number} | null {
		if (effect.kind === 'audio') return null

		const {rect} = effect
		const {position_on_canvas, width, height, scaleX, scaleY} = rect

		return {
			x: position_on_canvas.x - (width * scaleX) / 2,
			y: position_on_canvas.y - (height * scaleY) / 2,
			width: width * scaleX,
			height: height * scaleY
		}
	}

	/**
	 * Check if two bounding boxes intersect
	 */
	private boundsIntersect(
		a: {x: number, y: number, width: number, height: number},
		b: {x: number, y: number, width: number, height: number}
	): boolean {
		return !(
			a.x + a.width < b.x ||
			b.x + b.width < a.x ||
			a.y + a.height < b.y ||
			b.y + b.height < a.y
		)
	}

	/**
	 * Render all annotations from state
	 * Called when annotations change or canvas is redrawn
	 */
	public render(annotations: Annotation[]): void {
		// Clear existing rendered annotations
		this.clearAnnotations()

		// Render each annotation
		for (const annotation of annotations) {
			const graphics = new PIXI.Graphics()
			graphics.eventMode = 'none'
			this.renderAnnotation(graphics, annotation)
			//@ts-ignore - PIXI type compatibility
			this.annotationLayer.addChild(graphics)
			this.renderedAnnotations.set(annotation.id, graphics)
		}
	}

	/**
	 * Render a single annotation to a graphics object
	 */
	private renderAnnotation(graphics: PIXI.Graphics, annotation: Annotation): void {
		const {type, color, strokeWidth, coordinates} = annotation
		const lineColor = color || '#FF4444'
		const lineWidth = strokeWidth || 3

		//@ts-ignore - PIXI lineStyle compatibility
		graphics.lineStyle(lineWidth, lineColor, 1)

		switch (type) {
			case 'freehand':
				if (coordinates.path && coordinates.path.length > 0) {
					graphics.moveTo(coordinates.path[0].x, coordinates.path[0].y)
					for (let i = 1; i < coordinates.path.length; i++) {
						if (i > 1) {
							const lastPoint = coordinates.path[i - 1]
							const currentPoint = coordinates.path[i]
							const controlPoint = {
								x: (lastPoint.x + currentPoint.x) / 2,
								y: (lastPoint.y + currentPoint.y) / 2
							}
							graphics.quadraticCurveTo(lastPoint.x, lastPoint.y, controlPoint.x, controlPoint.y)
						} else {
							graphics.lineTo(coordinates.path[i].x, coordinates.path[i].y)
						}
					}
				}
				break

			case 'arrow':
				if (coordinates.start && coordinates.end) {
					graphics.moveTo(coordinates.start.x, coordinates.start.y)
					graphics.lineTo(coordinates.end.x, coordinates.end.y)
					this.renderArrowhead(graphics, coordinates.start, coordinates.end, lineColor, lineWidth)
				}
				break

			case 'rectangle':
				if (coordinates.start && coordinates.end) {
					const width = coordinates.end.x - coordinates.start.x
					const height = coordinates.end.y - coordinates.start.y
					graphics.drawRect(coordinates.start.x, coordinates.start.y, width, height)
				}
				break

			case 'circle':
				if (coordinates.center && coordinates.radius) {
					graphics.drawCircle(coordinates.center.x, coordinates.center.y, coordinates.radius)
				}
				break
		}
	}

	/**
	 * Render an arrowhead for arrow annotations
	 */
	private renderArrowhead(
		graphics: PIXI.Graphics,
		start: Point,
		end: Point,
		color: string,
		strokeWidth: number
	): void {
		const headLength = 15 + strokeWidth * 2
		const angle = Math.atan2(end.y - start.y, end.x - start.x)

		//@ts-ignore - PIXI beginFill compatibility
		graphics.beginFill(color)

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

	/**
	 * Clear all rendered annotations from the layer
	 */
	private clearAnnotations(): void {
		for (const [id, graphics] of this.renderedAnnotations) {
			this.annotationLayer.removeChild(graphics)
			graphics.destroy()
		}
		this.renderedAnnotations.clear()
	}

	/**
	 * Clear all annotations (called when drawing mode is disabled or reset)
	 */
	public clear(): void {
		this.clearAnnotations()
		this.actions.clear_annotations()
	}

	/**
	 * Get current state from compositor context
	 */
	private getState(): State {
		return omnislate.context.state
	}

	/**
	 * API for Member 4: Get all annotations with metadata
	 * Returns structured annotation data that can be serialized for AI consumption
	 */
	public getAnnotations(): Annotation[] {
		const state = this.getState()
		return state.annotations || []
	}

	/**
	 * API for Member 4: Serialize annotations to natural language
	 * Converts annotation data into human-readable descriptions for AI prompts
	 */
	public serializeAnnotationsForAI(state: State): string[] {
		const annotations = state.annotations || []

		return annotations.map(annotation => {
			const {type, color, coordinates, affectedEffects} = annotation
			let description = `User drew a ${color || 'red'} ${type}`

			// Add spatial information
			switch (type) {
				case 'freehand':
					description += ` stroke with ${coordinates.path?.length || 0} points`
					break
				case 'arrow':
					if (coordinates.start && coordinates.end) {
						const direction = this.getDirection(coordinates.start, coordinates.end)
						description += ` pointing ${direction}`
					}
					break
				case 'rectangle':
					if (coordinates.start && coordinates.end) {
						const width = Math.abs(coordinates.end.x - coordinates.start.x)
						const height = Math.abs(coordinates.end.y - coordinates.start.y)
						description += ` (${Math.round(width)}x${Math.round(height)}px)`
					}
					break
				case 'circle':
					if (coordinates.radius) {
						description += ` with radius ${Math.round(coordinates.radius)}px`
					}
					break
			}

			// Add affected effects information
			if (affectedEffects && affectedEffects.length > 0) {
				const effectNames = affectedEffects.map(effectId => {
					const effect = state.effects.find(e => e.id === effectId)
					if (effect) {
						const trackNum = effect.track + 1
						const name = 'name' in effect ? effect.name : effect.kind
						return `${effect.kind} "${name}" on track ${trackNum}`
					}
					return effectId
				})

				if (affectedEffects.length === 1) {
					description += ` over ${effectNames[0]}`
				} else {
					description += ` overlapping ${affectedEffects.length} effects: ${effectNames.join(', ')}`
				}
			} else {
				description += ` on empty canvas area`
			}

			return description
		})
	}

	/**
	 * Helper: Get direction description for arrows
	 */
	private getDirection(start: Point, end: Point): string {
		const dx = end.x - start.x
		const dy = end.y - start.y
		const angle = Math.atan2(dy, dx) * (180 / Math.PI)

		if (angle >= -22.5 && angle < 22.5) return 'right'
		if (angle >= 22.5 && angle < 67.5) return 'down-right'
		if (angle >= 67.5 && angle < 112.5) return 'down'
		if (angle >= 112.5 && angle < 157.5) return 'down-left'
		if (angle >= 157.5 || angle < -157.5) return 'left'
		if (angle >= -157.5 && angle < -112.5) return 'up-left'
		if (angle >= -112.5 && angle < -67.5) return 'up'
		if (angle >= -67.5 && angle < -22.5) return 'up-right'
		return 'right'
	}

	/**
	 * Update rendering when annotations change
	 * Should be called by the compositor when state.annotations changes
	 */
	public update(state: State): void {
		this.render(state.annotations)
	}

	/**
	 * Destroy the drawing manager and clean up resources
	 */
	public destroy(): void {
		this.clearAnnotations()
		this.compositor.app.stage.removeChild(this.annotationLayer)
		this.annotationLayer.destroy()
	}
}
