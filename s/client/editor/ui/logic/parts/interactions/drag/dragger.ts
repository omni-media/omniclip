
import {ms, Ms} from "@omnimedia/omnitool"

import {Idx} from "../../index.js"
import {DragSnapshot} from "./parts/snapshot.js"
import {resolveDropIntent} from "./parts/intent.js"
import type {OmniSession} from "../../../session.js"
import {getSnapCandidates, snap} from "./parts/snappy.js"
import {Proposal, type Overlay} from "../../proposal/proposal.js"
import type {Rules} from "../../../../../context/parts/rules/rules.js"
import {dropDestination, overlayFromDropIntent} from "./parts/overlay.js"
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
	rules: Rules
	clip: TimelineClipBox
	startPoint: Point
	snapshot: DragSnapshot
	snapCandidates: Ms[]
	blockedByRules: boolean
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
		const clips = [...session.canvas.clips]
		this.#state = {
			clip,
			startPoint: point,
			snapshot: new DragSnapshot(
				session.index,
				clips,
				session.$viewedItemId(),
			),
			snapCandidates: this.positionMode ? positionSnapCandidates(session, clip, clips) : [],
			rules: session.organization.rules(session.index),
			blockedByRules: false,
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
			ghost.x = session.viewport.timeToX(snap(
				positionStart(session, state.clip, ghost),
				session.viewport.widthToDuration(SNAP_THRESHOLD_PX),
				state.snapCandidates,
			))

		session.setGhostClip(ghost)

		const drop = this.#resolvePreviewDrop(
			session,
			state,
			ghost,
		)

		session.$drop(drop)
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
		session.$drop(null)
		if (this.isDragging && !this.positionMode)
			session.canvas.switchCursor("select")

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

		const destination = resolvedDrop && dropDestination(snapshot.index, resolvedDrop)
		const container = destination?.container ?? destination?.targetParent
		state.blockedByRules = !!resolvedDrop && (
			!container || !state.rules.allowsItem(container.id, clip.itemId)
		)
		if (state.blockedByRules) {
			session.canvas.canvas.style.cursor = "not-allowed"
			return null
		}

		if (!this.positionMode) {
			session.canvas.canvas.style.cursor = "default"
			return resolvedDrop
		}

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
		// A null drop can still mean a position change, so keep blocked drops separate.
		if (state.blockedByRules)
			return

		const drop = session.$drop()
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
			drop: session.$drop(),
		})

		commitOverlay(session, overlay)
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
			newContainerId: session.getId(),
		})

		if (overlay)
			commitOverlay(session, overlay)
	}
}

function commitOverlay(session: OmniSession, overlay: Overlay) {
	const proposal = new Proposal(session.timeline, overlay)
	if (session.organization.rules(proposal.index).valid())
		proposal.commit()
}

function dragOffset(start: Point, current: Point) {
	return {
		dx: current.x - start.x,
		dy: current.y - start.y,
	}
}

function positionSnapCandidates(session: OmniSession, moving: TimelineClipBox, clips: TimelineClipBox[]) {
	const targets = [
		session.$playhead(),
		...clips
			.filter(clip => clip.itemId !== moving.itemId && Idx.isClip(clip.kind))
			.flatMap(clip => [clip.start, ms(clip.start + clip.duration)]),
	]
	return getSnapCandidates(targets, [{
		start: moving.start,
		end: ms(moving.start + moving.duration),
	}], moving.start)
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
