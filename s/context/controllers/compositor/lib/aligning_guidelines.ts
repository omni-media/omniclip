import {Keys} from "./util.js"
import {Compositor} from "../controller.js"

type VerticalLineCoords = {
	x: number;
	y1: number;
	y2: number;
};

type HorizontalLineCoords = {
	y: number;
	x1: number;
	x2: number;
};

type IgnoreObjTypes = { key: string; value: any }[];

type ACoordsAppendCenter = {
	tl: PIXI.Point
	tr: PIXI.Point
	bl: PIXI.Point
	br: PIXI.Point
	c: PIXI.Point
}

export class AlignGuidelines {
	aligningLineMargin = 30;
	aligningLineWidth = 6;
	aligningLineColor = "#F68066";
	ignoreObjTypes: IgnoreObjTypes = [];
	pickObjTypes: IgnoreObjTypes = [];

	app: PIXI.Application<PIXI.Renderer<any>>
	compositor: Compositor
	viewportTransform: any;
	verticalLines: VerticalLineCoords[] = [];
	horizontalLines: HorizontalLineCoords[] = [];

	graphics = new PIXI.Graphics() // graphics for align guidelines

	constructor({
		compositor,
		app,
		aligningOptions,
		ignoreObjTypes,
		pickObjTypes,
	}: {
		app: PIXI.Application
		compositor: Compositor
		ignoreObjTypes?: IgnoreObjTypes;
		pickObjTypes?: IgnoreObjTypes;
		aligningOptions?: {
			lineMargin?: number;
			lineWidth?: number;
			lineColor?: string;
		};
	}) {
		this.compositor = compositor
		this.app = app
		this.ignoreObjTypes = ignoreObjTypes || [];
		this.pickObjTypes = pickObjTypes || [];
		this.app.stage.addChild(this.graphics)

		if (aligningOptions) {
			this.aligningLineMargin = aligningOptions.lineMargin || this.aligningLineMargin;
			this.aligningLineWidth = aligningOptions.lineWidth || this.aligningLineWidth;
			this.aligningLineColor = aligningOptions.lineColor || this.aligningLineColor;
		}
	}

	private drawSign(x: number, y: number) {
		// Draw a small "X" at the given point using setStrokeStyle.
		this.graphics.lineStyle(this.aligningLineWidth, parseInt(this.aligningLineColor.replace("#", "0x")), 1)
		const size = 2
		this.graphics.moveTo(x - size, y - size)
		this.graphics.lineTo(x + size, y + size)
		this.graphics.moveTo(x + size, y - size)
		this.graphics.lineTo(x - size, y + size)
	}

	private drawLine(x1: number, y1: number, x2: number, y2: number) {
		const point1 = transformPoint(new PIXI.Point(x1, y1), new PIXI.Matrix());
		const point2 = transformPoint(new PIXI.Point(x2, y2), new PIXI.Matrix());
		const strokeColor = parseInt(this.aligningLineColor.replace("#", "0x"))
		this.graphics.lineStyle(this.aligningLineWidth, this.aligningLineColor, 1)
		this.graphics.moveTo(point1.x, point1.y);
		this.graphics.lineTo(point2.x, point2.y)
		// this.compositor.graphics.stroke({width: this.aligningLineWidth, color: this.aligningLineColor})
		this.graphics.zIndex = 500
		this.app.stage.sortChildren()
		this.drawSign(point1.x, point1.y);
		this.drawSign(point2.x, point2.y);
	}

	private drawVerticalLine(coords: VerticalLineCoords) {
		const activeObject = this.compositor.selectedElement
		if(!activeObject) {return}
		const movingCoords = this.getObjDraggingObjCoords(activeObject.sprite);
		if (!Keys(movingCoords).some((key) => Math.abs(movingCoords[key].x - coords.x) < 0.0001)) return;
		this.drawLine(coords.x, Math.min(coords.y1, coords.y2), coords.x, Math.max(coords.y1, coords.y2));
	}

	private drawHorizontalLine(coords: HorizontalLineCoords) {
		const activeObject = this.compositor.selectedElement
		if(!activeObject) {return}
		const movingCoords = this.getObjDraggingObjCoords(activeObject.sprite);
		if (!Keys(movingCoords).some((key) => Math.abs(movingCoords[key].y - coords.y) < 0.0001)) return;
		this.drawLine(Math.min(coords.x1, coords.x2), coords.y, Math.max(coords.x1, coords.x2), coords.y);
	}

	private isInRange(value1: number, value2: number) {
		// Assume that the stage scale represents the current zoom (uniform scale)
		const zoom = this.app.stage.scale.x || 1
		return Math.abs(Math.round(value1) - Math.round(value2)) <= this.aligningLineMargin / zoom
	}

	private watchMouseDown() {
		this.app.stage.on("pointerdown", () => {
			this.clearLinesMeta();
			this.viewportTransform = this.app.stage.worldTransform;
		});
	}

	private watchMouseUp() {
		this.app.stage.on("pointerup", () => {
			this.clearLinesMeta()
			this.clearGuideline()
			this.app.renderer.render(this.app.stage);
		});
	}

	private watchMouseWheel() {
		this.app.stage.addEventListener("wheel", () => {
			this.clearLinesMeta();
		});
	}

	private clearLinesMeta() {
		this.verticalLines.length = this.horizontalLines.length = 0;
	}

	on_object_move_or_scale(e: PIXI.FederatedPointerEvent) {
		this.clearLinesMeta()
		this.clearGuideline()
		const activeObject = this.compositor.selectedElement?.sprite
		if(!activeObject) {return}
		const canvasObjects = this.compositor.app.stage.children.filter(obj => {
			if (this.ignoreObjTypes.length) {
				return !this.ignoreObjTypes.some(item => (obj as any)[item.key] === item.value)
			}
			if (this.pickObjTypes.length) {
				return this.pickObjTypes.some(item => (obj as any)[item.key] === item.value)
			}
			return true
		})
		const transform = activeObject.worldTransform
		if (!transform) return
		this.traversAllObjects(e, activeObject, canvasObjects)
	}

	private watchObjectMoving() {
		// this.canvas.on("object:moving", (e) => this.on_object_move_or_scale(e));
		// this.canvas.on("object:scaling", (e) => this.on_object_move_or_scale(e));
	}

	private getObjDraggingObjCoords(activeObject: PIXI.Container): ACoordsAppendCenter {
		const bounds = activeObject.getBounds()
		const aCoords = {
			tl: new PIXI.Point(bounds.x, bounds.y),
			tr: new PIXI.Point(bounds.x + bounds.width, bounds.y),
			bl: new PIXI.Point(bounds.x, bounds.y + bounds.height),
			br: new PIXI.Point(bounds.x + bounds.width, bounds.y + bounds.height),
		}
		const centerPoint = new PIXI.Point((aCoords.tl.x + aCoords.br.x) / 2, (aCoords.tl.y + aCoords.br.y) / 2)
		const computedCenter = new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
		const offsetX = centerPoint.x - computedCenter.x
		const offsetY = centerPoint.y - computedCenter.y
		return Object.keys(aCoords).reduce((acc, k) => {
			const key = k as keyof typeof aCoords
			acc[key] = new PIXI.Point(aCoords[key].x - offsetX, aCoords[key].y - offsetY)
			return acc
		}, { c: computedCenter } as ACoordsAppendCenter)
	}

	private omitCoords(objCoords: ACoordsAppendCenter, type: "vertical" | "horizontal") {
		let newCoords;
		type PointArr = [keyof ACoordsAppendCenter, PIXI.Point];
		if (type === "vertical") {
			let l: PointArr = ["tl", objCoords.tl];
			let r: PointArr = ["tl", objCoords.tl];
			Keys(objCoords).forEach((key) => {
				if (objCoords[key].x < l[1].x) {
					l = [key, objCoords[key]];
				}
				if (objCoords[key].x > r[1].x) {
					r = [key, objCoords[key]];
				}
			});
			newCoords = {
				[l[0]]: l[1],
				[r[0]]: r[1],
				c: objCoords.c,
			} as ACoordsAppendCenter;
		} else {
			let t: PointArr = ["tl", objCoords.tl];
			let b: PointArr = ["tl", objCoords.tl];
			Keys(objCoords).forEach((key) => {
				if (objCoords[key].y < t[1].y) {
					t = [key, objCoords[key]];
				}
				if (objCoords[key].y > b[1].y) {
					b = [key, objCoords[key]];
				}
			});
			newCoords = {
				[t[0]]: t[1],
				[b[0]]: b[1],
				c: objCoords.c,
			} as ACoordsAppendCenter;
		}
		return newCoords;
	}

	private getObjMaxWidthHeightByCoords(coords: ACoordsAppendCenter) {
		const objHeight = Math.max(Math.abs(coords.c.y - coords["tl"].y), Math.abs(coords.c.y - coords["tr"].y)) * 2;
		const objWidth = Math.max(Math.abs(coords.c.x - coords["tl"].x), Math.abs(coords.c.x - coords["tr"].x)) * 2;
		return { objHeight, objWidth };
	}

	/**
	 * fabric.Object.getCenterPoint will return the center point of the object calc by mouse moving & dragging distance.
	 * calcCenterPointByACoords will return real center point of the object position.
	 */
	private calcCenterPointByACoords(object: PIXI.Container): PIXI.Point {
		const bounds = object.getBounds()
		return new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
	}

	private traversAllObjects(event: PIXI.FederatedPointerEvent, activeObject: PIXI.Container, canvasObjects: PIXI.Container[]) {
		const objCoordsByMovingDistance = this.getObjDraggingObjCoords(activeObject)
		const snapXPoints: number[] = []
		const snapYPoints: number[] = []

		for (let i = canvasObjects.length; i--; ) {
			if (canvasObjects[i] === activeObject) continue
			const objCoords = this.getObjDraggingObjCoords(canvasObjects[i])
			const { objWidth, objHeight } = this.getObjMaxWidthHeightByCoords(objCoords)
			
			Object.keys(objCoordsByMovingDistance).forEach((point) => {
				const newCoords = (canvasObjects[i] as any).rotation !== 0
					? this.omitCoords(objCoords, "horizontal")
					: objCoords

				function calcHorizontalLineCoords(
					objPoint: keyof ACoordsAppendCenter,
					activeObjCoords: ACoordsAppendCenter
				) {
					const activeObjPoint = point as keyof ACoordsAppendCenter
					let x1: number, x2: number
					if (objPoint === "c") {
						x1 = Math.min(objCoords.c.x - objWidth / 2, activeObjCoords[activeObjPoint].x)
						x2 = Math.max(objCoords.c.x + objWidth / 2, activeObjCoords[activeObjPoint].x)
					} else {
						x1 = Math.min(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x)
						x2 = Math.max(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x)
					}
					return { x1, x2 }
				}

				Object.keys(newCoords).forEach((objp) => {
					const objPoint = objp as keyof typeof newCoords
					const activeObjPoint = point as keyof ACoordsAppendCenter
					if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].y, newCoords[objPoint].y)) {
						const y = newCoords[objPoint].y
						const { x1, x2 } = calcHorizontalLineCoords(objPoint as keyof ACoordsAppendCenter, objCoordsByMovingDistance)
						const offset = objCoordsByMovingDistance[activeObjPoint].y - y
						snapYPoints.push(objCoordsByMovingDistance.c.y - offset)
						if ((activeObject as any).aCoords) {
							const calcCenter = this.calcCenterPointByACoords((activeObject as any).aCoords)
							const { x1, x2 } = calcHorizontalLineCoords("c", { ...this.getObjDraggingObjCoords(activeObject), c: calcCenter } as ACoordsAppendCenter)
							this.horizontalLines.push({ y, x1, x2 })
						} else {
							this.horizontalLines.push({ y, x1, x2 })
						}
					}
				})
			})

			Object.keys(objCoordsByMovingDistance).forEach((activePoint) => {
				const activeObjPoint = activePoint as keyof ACoordsAppendCenter 
				const newCoords = (canvasObjects[i] as any).rotation !== 0
					? this.omitCoords(objCoords, "vertical")
					: objCoords

				function calcVerticalLineCoords(
					objPoint: keyof ACoordsAppendCenter,
					activeObjCoords: ACoordsAppendCenter
				) {
					let y1: number, y2: number
					if (objPoint === "c") {
						y1 = Math.min(newCoords.c.y - objHeight / 2, activeObjCoords[activeObjPoint].y)
						y2 = Math.max(newCoords.c.y + objHeight / 2, activeObjCoords[activeObjPoint].y)
					} else {
						y1 = Math.min(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y)
						y2 = Math.max(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y)
					}
					return { y1, y2 }
				}

				Object.keys(newCoords).forEach((objp) => {
					const objPoint = objp as keyof typeof newCoords
					if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].x, newCoords[objPoint].x)) {
						const x = newCoords[objPoint].x
						const { y1, y2 } = calcVerticalLineCoords(objPoint as keyof ACoordsAppendCenter, objCoordsByMovingDistance)
						const offset = objCoordsByMovingDistance[activeObjPoint].x - x
						snapXPoints.push(objCoordsByMovingDistance.c.x - offset)
						if ((activeObject as any).aCoords) {
							const calcCenter = this.calcCenterPointByACoords((activeObject as any).aCoords)
							const { y1, y2 } = calcVerticalLineCoords("c", { ...this.getObjDraggingObjCoords(activeObject), c: calcCenter } as ACoordsAppendCenter)
							this.verticalLines.push({ x, y1, y2 })
						} else {
							this.verticalLines.push({ x, y1, y2 })
						}
					}
				})
			})

			this.snap({
				event,
				activeObject,
				draggingObjCoords: objCoordsByMovingDistance,
				snapXPoints,
				snapYPoints,
			})
		}
	}

private snap({
		event,
		activeObject,
		snapXPoints,
		draggingObjCoords,
		snapYPoints,
	}: {
		event: PIXI.FederatedPointerEvent,
		activeObject: PIXI.Container
		snapXPoints: number[]
		draggingObjCoords: ACoordsAppendCenter
		snapYPoints: number[]
	}) {

		const sortPoints = (list: number[], origin: number) => {
			if (!list.length) return origin
			return list
				.map(val => ({ abs: Math.abs(origin - val), val }))
				.sort((a, b) => a.abs - b.abs)[0].val
		}

		const candidateSnapGlobal = new PIXI.Point(
			sortPoints(snapXPoints, draggingObjCoords.c.x),
			sortPoints(snapYPoints, draggingObjCoords.c.y)
		)

		const pivotGlobal = activeObject.parent.toGlobal(activeObject.position)
		const bounds = activeObject.getBounds()
		const geometricCenter = new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
		const offset = new PIXI.Point(geometricCenter.x - pivotGlobal.x, geometricCenter.y - pivotGlobal.y)

		const newPivotGlobal = new PIXI.Point(
			candidateSnapGlobal.x - offset.x,
			candidateSnapGlobal.y - offset.y
		)

		const newPivotLocal = activeObject.parent.toLocal(newPivotGlobal)
		activeObject.position.set(newPivotLocal.x, newPivotLocal.y)
	}

	clearGuideline() {
		this.graphics.clear()
	}

	watchRender() {
		this.app.ticker.add(() => {
			for (let i = this.verticalLines.length; i--; ) {
				this.drawVerticalLine(this.verticalLines[i])
			}
			for (let i = this.horizontalLines.length; i--; ) {
				this.drawHorizontalLine(this.horizontalLines[i])
			}
		})
	}

	init() {
		this.watchObjectMoving();
		this.watchRender();
		this.watchMouseDown();
		this.watchMouseUp();
		this.watchMouseWheel();
	}
}

export const transformPoint = (
	p: { x: number, y: number },
	t: PIXI.Matrix,
	ignoreOffset?: boolean
): PIXI.Point => {
	const pt = new PIXI.Point(p.x, p.y)
	if (ignoreOffset) {
		// Create a copy of the matrix without the translation components.
		const m = new PIXI.Matrix(t.a, t.b, t.c, t.d, 0, 0)
		return m.apply(pt)
	}
	return t.apply(pt)
}
