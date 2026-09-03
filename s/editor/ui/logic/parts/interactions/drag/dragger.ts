
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import type {OmniSession} from "../../../session.js"
import {DragSnapshot} from "./parts/snapshot.js"
import {resolveDropIntent} from "./parts/intent.js"
import {Proposal} from "../../proposal/proposal.js"
import {overlayFromDropIntent} from "./parts/overlay.js"
import {
	isPositionDropBlocked,
	overlayFromPosition,
	resolvePositionDrop,
} from "./parts/position/resolve.js"
import type {TimelineClipBox} from "../../../../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"

type Point = {
	x: number
	y: number
}

const SNAP_THRESHOLD_PX = 8

type DragState = {
	clip: TimelineClipBox
	startPoint: Point
	snapshot: DragSnapshot
}

export class Dragger {
	#state: DragState | null = null

	isDragging = false

	constructor(private readonly positionMode = false) {}

	start(
		clip: TimelineClipBox,
		point: Point,
		session: OmniSession,
	) {
		this.isDragging = false
		this.#state = {
			clip,
			startPoint: point,
			snapshot: new DragSnapshot(
				session.index,
				[...session.canvas.clips],
				session.$viewedItemId.value,
			),
		}
	}

	preview(point: Point, session: OmniSession) {
		const state = this.#state
		if (!state)
			return null

		const {dx, dy} = dragOffset(state.startPoint, point)

		if (!this.isDragging && Math.hypot(dx, dy) < 4)
			return null

		this.isDragging = true
		session.clearGhostPlayhead()

		const ghost = {
			...state.clip,
			x: state.clip.x + dx,
			y: state.clip.y + dy,
		}
		if (this.positionMode)
			ghost.x = snapToPlayhead(session, ghost)

		session.setGhostClip(ghost)

		const drop = this.#resolvePreviewDrop(
			session,
			state,
			ghost,
		)

		session.$drop.value = drop
		session.canvas.scheduleDraw()
	}

	commit(session: OmniSession) {
		const state = this.#state

		if (this.isDragging && state)
			this.#commitDrag(session, state)

		this.cancel(session)
	}

	cancel(session: OmniSession) {
		session.setGhostClip(null)
		session.$drop.value = null

		this.#state = null
		this.isDragging = false

		if (this.positionMode)
			session.canvas.switchCursor("position")

		session.canvas.scheduleDraw()
	}

	#resolvePreviewDrop(
		session: OmniSession,
		state: DragState,
		ghost: TimelineClipBox,
	) {
		const {clip, snapshot} = state

		const resolvedDrop = resolveDropIntent(
			snapshot,
			clip.itemId,
			ghost,
		)

		if (!this.positionMode)
			return resolvedDrop

		const preview = {
			snapshot,
			movingId: clip.itemId,
			desiredStart: positionStart(session, clip, ghost),
			drop: resolvedDrop,
		}

		const drop = resolvePositionDrop(preview)
		const blocked = isPositionDropBlocked({
			...preview,
			drop,
		})

		session.canvas.canvas.style.cursor = blocked
			? "not-allowed"
			: "move"

		return drop
	}

	#commitDrag(
		session: OmniSession,
		state: DragState,
	) {
		const drop = session.$drop.value
		const ghost = session.$ghostClip()

		const desiredStart =
			ghost && this.positionMode
				? positionStart(session, state.clip, ghost)
				: null

		if (desiredStart !== null) {
			this.#commitPosition(session, state, desiredStart)
			return
		}

		if (drop)
			this.#commitDrop(session, state, drop)
	}

	#commitPosition(
		session: OmniSession,
		state: DragState,
		desiredStart: ReturnType<typeof positionStart>,
	) {
		const overlay = overlayFromPosition({
			session,
			snapshot: state.snapshot,
			movingId: state.clip.itemId,
			desiredStart,
			drop: session.$drop.value,
		})

		new Proposal(session.timeline, overlay).commit()
	}

	#commitDrop(
		session: OmniSession,
		state: DragState,
		drop: NonNullable<ReturnType<typeof resolveDropIntent>>,
	) {
		const overlay = overlayFromDropIntent({
			drop,
			index: state.snapshot.index,
			movingId: state.clip.itemId,
			newContainerId: session.deps.omnitool.getId(),
		})

		if (overlay)
			new Proposal(session.timeline, overlay).commit()
	}
}

function dragOffset(start: Point, current: Point) {
	return {
		dx: current.x - start.x,
		dy: current.y - start.y,
	}
}

function snapToPlayhead(session: OmniSession, clip: TimelineClipBox) {
	const playheadX = session.viewport.timeToX(session.$playhead())
	const startX = playheadX
	const endX = playheadX - clip.width
	const snappedX = endX >= 0 && Math.abs(endX - clip.x) < Math.abs(startX - clip.x)
		? endX
		: startX
	return Math.abs(snappedX - clip.x) <= SNAP_THRESHOLD_PX ? snappedX : clip.x
}

function positionStart(
	session: OmniSession,
	clip: TimelineClipBox,
	ghost: TimelineClipBox,
) {
	const offset = session.viewport.widthToDuration(
		ghost.x - clip.x,
	)

	return ms(Math.max(0, clip.start + offset))
}
