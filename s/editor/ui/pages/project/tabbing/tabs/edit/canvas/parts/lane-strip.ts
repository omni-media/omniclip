
import {fitCanvasText} from "../draw/text.js"
import type {TimelineCanvas} from "../canvas.js"
import {metrics, styles} from "../draw/styles.js"

const badge = {insetX: 6, compactWidth: 12, expandedWidth: 174, insetY: 8}

const badgeWidth = (reveal: number) =>
	badge.compactWidth + (badge.expandedWidth - badge.compactWidth) * reveal

const roleLanes = (canvas: TimelineCanvas) => new Map(canvas.layout.clips.map(clip => [
	canvas.rowAt(clip.y + clip.height / 2), clip.roleId
]))

export class LaneStrip {
	#hoveredRoleLane: number | null = null
	#reveals = new Map<number, {value: number, time: number}>()

	constructor(private canvas: TimelineCanvas) {}

	draw = () => {
		for (const [row, roleId] of roleLanes(this.canvas)) {
			const role = this.canvas.deps.session.roles.lookup.get(roleId)
			if (!role)
				continue

			const reveal = this.#reveal(row)
			const width = badgeWidth(reveal)
			const y = this.canvas.trackY(row) + badge.insetY
			const height = metrics.trackHeight - badge.insetY * 2
			const ctx = this.canvas.ctx

			ctx.save()
			ctx.beginPath()
			ctx.roundRect(badge.insetX, y, width, height, 6)
			ctx.clip()
			ctx.fillStyle = "rgba(22, 24, 29, 0.94)"
			ctx.fillRect(badge.insetX, y, width, height)

			if (reveal === 0) {
				ctx.fillStyle = role.color
				ctx.fillRect(badge.insetX, y, badge.compactWidth, height)
			}
			else {
				const accent = ctx.createLinearGradient(badge.insetX, y, badge.insetX + 58, y)
				accent.addColorStop(0, role.color)
				accent.addColorStop(0.18, role.color)
				accent.addColorStop(1, "rgba(22, 24, 29, 0)")
				ctx.globalAlpha = 0.82
				ctx.fillStyle = accent
				ctx.fillRect(badge.insetX, y, Math.min(width, 58), height)
			}

			if (reveal > 0) {
				ctx.globalAlpha = reveal
				ctx.fillStyle = styles.text
				ctx.strokeStyle = "rgba(8, 10, 13, 0.9)"
				ctx.lineWidth = 3
				ctx.font = "600 12px sans-serif"
				ctx.textBaseline = "middle"
				ctx.textAlign = "center"
				const label = fitCanvasText(ctx, role.name, Math.max(0, width - 34))
				ctx.strokeText(label, badge.insetX + width / 2, y + height / 2 + 0.5)
				ctx.fillText(label, badge.insetX + width / 2, y + height / 2 + 0.5)
			}

			ctx.globalAlpha = 0.38 + reveal * 0.22
			ctx.strokeStyle = role.color
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.roundRect(badge.insetX + 0.5, y + 0.5, width - 1, height - 1, 5.5)
			ctx.stroke()
			ctx.restore()
		}
	}

	hover(point: {x: number, y: number} | null) {
		const row = point === null ? null : this.#roleLaneAt(point)
		if (this.#hoveredRoleLane !== row) {
			this.#hoveredRoleLane = row
			this.canvas.scheduleDraw()
		}
	}

	#reveal = (row: number) => {
		const now = performance.now()
		const state = this.#reveals.get(row) ?? {value: 0, time: now}
		const direction = this.#hoveredRoleLane === row ? 1 : -1
		state.value = Math.max(0, Math.min(1, state.value + direction * (now - state.time) / 160))
		state.time = now
		this.#reveals.set(row, state)
		if ((direction > 0 && state.value < 1) || (direction < 0 && state.value > 0))
			this.canvas.scheduleDraw()
		return state.value
	}

	#roleLaneAt(point: {x: number, y: number}) {
		const row = this.canvas.rowAt(point.y)
		return roleLanes(this.canvas).has(row) &&
			point.x >= badge.insetX - 2 && point.x <= badge.insetX + badge.compactWidth + 2
			? row
			: null
	}
}

