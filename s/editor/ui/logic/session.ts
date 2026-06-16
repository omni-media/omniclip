
import {is} from "@e280/stz"
import {derived, signal} from "@e280/strata"
import {visualAnimations} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"
import type {Transform, TransformAnimation} from "@omnimedia/omnitool/x/timeline/types.js"
import {computeItemDuration} from "@omnimedia/omnitool/x/timeline/renderers/parts/handy.js"
import {Driver, Id, Item, Kind, O, Resource, TimelineFile, TransitionName, VideoPlayer} from "@omnimedia/omnitool"

import {Stage} from "./parts/stage.js"
import {Tool} from "./parts/modes/tool.js"
import {Idx, Index} from "./parts/index.js"
import {Viewport} from "./parts/viewport.js"
import {Playback} from "./parts/playback.js"
import {selectTool} from "./parts/modes/select.js"
import {Strata} from "../../context/parts/strata.js"
import {add, remove, update} from "./parts/mutate.js"
import {Proposal} from "./parts/proposal/proposal.js"
import {trim} from "./parts/interactions/trim/parts/action.js"
import {DropIntent} from "./parts/interactions/drag/parts/intent.js"
import {resizeTransition} from "./parts/interactions/trim/parts/transition.js"
import {TimelineCanvas} from "../pages/project/tabbing/tabs/edit/canvas/canvas.js"
import {PIXELS_PER_MILLISECOND} from "../pages/project/tabbing/tabs/edit/constants.js"
import {TimelineClipBox} from "../pages/project/tabbing/tabs/edit/canvas/draw/clip.js"
import {replaceChild, splitClip, wrapChildInSequence} from "./parts/operations/operations.js"
import {
	cloneAnimation,
	hasAnyKeyframes,
	type SpatialLike,
} from "../pages/project/tabbing/tabs/inspector/views/controls/keyframes/utils.js"

export class OmniSession {
	#index

	$playhead = signal<Ms>(ms(0))
	$ghostPlayhead = signal<Ms | null>(null)

	$selectedItem = signal<Id | null>(null)
	$viewedItemId = signal<Id>(0)
	$proposal = signal<Proposal | null>(null)
	$ghostClip = signal<TimelineClipBox | null>(null)
	$trimPreviewOffsetPx = signal(0)
	$dropIntent = signal<{movingId: Id, intent: DropIntent} | null>(null)

	viewport = new Viewport(PIXELS_PER_MILLISECOND)

	canvas
	stage
	playback
	activeMode = signal(selectTool(this))

	constructor(public deps: {
		strata: Strata,
		omnitool: O,
		player: VideoPlayer,
		driver: Driver,
		resolveMedia: (item: Item.Any) => Resource.Media | null,
	}) {
		this.canvas = new TimelineCanvas({
			session: this,
			timeline: this.deps.strata.timeline,
			player: this.deps.player,
			driver: this.deps.driver,
			settings: this.deps.strata.settings,
			resolveMedia: this.deps.resolveMedia,
		})
		this.stage = new Stage(this)
		this.playback = new Playback(this.deps.player)
		this.#index = derived(() => new Index(deps.strata.timeline.state as TimelineFile))
		this.$viewedItemId.value = deps.strata.timeline.state.rootId

		this.viewport.$width.on(this.#updateMinZoom)
		this.deps.strata.timeline.lens(s => s).on(() => {
			this.#updateMinZoom()
			this.setPlayhead(this.$playhead.value)
		})

		this.$ghostPlayhead.on(time => {
			if(!this.playback.$isPlaying.value) {
				if(is.happy(time))
					this.deps.player.seek(time)
				else
					this.deps.player.seek(this.$playhead())
			}
		})
	}

	/**
	 * After undo/redo reconcile session state
	 * */
	reconcile() {
		const index = this.#index()

		if (!index.getItemMaybe(this.$viewedItemId.value))
			this.$viewedItemId.value = this.timeline.state.rootId

		if (!index.getItemMaybe(this.$selectedItem.value))
			this.$selectedItem.value = null

		this.clearProposal()
		this.canvas.clearPreviews()
		this.canvas.scheduleDraw()
	}

	get timeline() {
		return this.deps.strata.timeline
	}

	get index() {
		return this.$proposal.value?.index ?? this.#index()
	}

	async redo() {
		await this.timeline.redo()
		this.reconcile()
	}

	async undo() {
		//TODO: undo does not undo rotation correctly
		await this.timeline.undo()
		this.reconcile()
	}

	setProposal(proposal: Proposal | null) {
		this.$proposal.value = proposal
	}

	clearProposal() {
		this.$proposal.value = null
	}

	applyTransitionToSelection(name: TransitionName, duration: number) {
		const selected = this.index.getItemMaybe(this.$selectedItem.value)
		if (!selected)
			return false

		const parent = this.index.getParent(selected.id)
		if (parent?.kind !== Kind.Sequence)
			return false

		if (selected.kind === Kind.Transition)
			return this.#updateTransition(selected.id, name, duration)

		const childIndex = parent.childrenIds.indexOf(selected.id)
		if (!this.#isVisualItem(selected) || childIndex === -1)
			return false

		const [prev, next] = [-1, 1].map(d => this.index.getItemMaybe(parent.childrenIds[childIndex + d]))
		const transition = [prev, next].find(s => s?.kind === Kind.Transition)
		if (transition)
			return this.#updateTransition(transition.id, name, duration)

		const index = this.#isVisualItem(next) ? childIndex + 1 : this.#isVisualItem(prev) ? childIndex : -1
		if (index === -1)
			return false

		const created = this.deps.omnitool.transition[name](duration)
		this.timeline.mutate(s => {
			const childrenIds = [...parent.childrenIds]
			childrenIds.splice(index, 0, created.id)
			this.#applyTransitionResize(s, {...created, duration: 0}, duration, childrenIds, index)
			update(s, parent.id, {childrenIds})
		})

		this.$selectedItem.value = created.id
		this.canvas.scheduleDraw()
		return true
	}

	#applyTransitionResize(state: TimelineFile, transition: Item.Transition, duration: number, childrenIds: readonly Id[], index: number) {
		const prev = this.index.getItemMaybe<Idx.Clip>(childrenIds[index - 1])
		const next = this.index.getItemMaybe<Idx.Clip>(childrenIds[index + 1])
		const overlay = resizeTransition(transition, duration, prev, next, this.deps.resolveMedia)

		for (const [id, item] of overlay)
			update(state, id, item)
	}

	#updateTransition(id: Id, name: TransitionName, duration: number) {
		this.timeline.mutate(s => update(s, id, {name, duration}))
		this.$selectedItem.value = id
		this.canvas.scheduleDraw()
		return true
	}

	#isVisualItem(item: Item.Any | undefined): item is Item.Video | Item.Image | Item.Text | Item.Caption {
		return [Kind.Video, Kind.Image, Kind.Text, Kind.Caption].includes(item?.kind as Kind)
	}

	setDropIntent(dropIntent: {movingId: Id, intent: DropIntent} | null) {
		this.$dropIntent.value = dropIntent
	}

	setGhostClip(ghostClip: TimelineClipBox | null) {
		this.$ghostClip.value = ghostClip
	}

	setTrimPreviewOffsetPx(offset: number) {
		this.$trimPreviewOffsetPx.value = offset
	}

	setMode(mode: Tool) {
		const isSame = mode(this).id === this.activeMode.value.id
		if(isSame) {
			this.activeMode(selectTool(this))
		}
		else {
			this.activeMode(mode(this))
		}
		this.canvas.clearPreviews()
		this.canvas.switchCursor(this.activeMode.value.id)
		this.canvas.scheduleDraw()
	}

	setPlayhead(time: Ms) {
		this.$playhead.set(ms(Math.min(Math.max(0, time), this.viewedDuration())))
	}

	setGhostPlayhead(time: Ms | null) {
		this.$ghostPlayhead.set(time)
	}

	clearGhostPlayhead() {
		this.$ghostPlayhead.set(null)
	}

	viewedDuration() {
		return computeItemDuration(this.$viewedItemId.value, this.deps.strata.timeline.state)
	}

	#computeMinZoom() {
		const duration = this.viewedDuration()
		const width = this.viewport.width
		const timelineFill = 0.5
		const zoom = duration && width
			? width * timelineFill / (duration * this.viewport.pixelsPerMillisecond)
			: 0.2

		return Math.min(1, zoom)
	}

	#updateMinZoom = () => {
		this.viewport.setMinZoom(this.#computeMinZoom())
	}

	updateTransformAnimation(
		item: Item.Text | Item.Video | Item.Image,
		transform: Transform,
		mutateAnimation: (draft: TransformAnimation) => void,
	) {
		const spatial = this.index.getItemMaybe<SpatialLike>(item.spatialId) ?? this.deps.omnitool.spatial()
		const animation = (item.animationIds ?? [])
			.map(id => this.index.getItemMaybe<Item.Animation>(id))
			.find(animation => animation?.anims.transform)
		const draft = animation?.anims.transform
			? cloneAnimation(animation.anims.transform)
			: this.deps.omnitool.anim.transform(visualAnimations.transform.defaultTerp, [])

		mutateAnimation(draft)

		this.timeline.mutate(state => {
			if (item.spatialId !== spatial.id)
				update(state, item.id, {spatialId: spatial.id})

			if (hasAnyKeyframes(draft)) {
				if (animation) {
					update(state, animation.id, {
						anims: {...animation.anims, transform: draft},
						enabled: true
					})
				}
				else {
					const animationId = this.deps.omnitool.getId()
					add(state, {
						id: animationId,
						kind: Kind.Animation,
						anims: {transform: draft},
						enabled: true,
					})
					update(state, item.id, {
						animationIds: [...(item.animationIds ?? []), animationId],
					})
				}
				update(state, spatial.id, {transform: this.deps.omnitool.transform()})
				return
			}

			if (animation) {
				const {transform: _removed, ...anims} = animation.anims
				if (Object.keys(anims).length)
					update(state, animation.id, {anims})
				else {
					remove(state, animation.id)
					update(state, item.id, {
						animationIds: (item.animationIds ?? []).filter(id => id !== animation.id),
					})
				}
			}

			update(state, spatial.id, {transform})
		})
	}

	stepPlayheadFrame(direction: -1 | 1) {
		const frameDuration = 1000 / this.deps.strata.settings.state.timebase
		const currentFrame = this.$playhead.value / frameDuration

		const nextFrame = direction > 0
			? Math.floor(currentFrame) + 1
			: Math.ceil(currentFrame) - 1
		const time = ms(Math.max(0, Math.min(this.deps.player.duration, nextFrame * frameDuration)))

		this.deps.player.seek(time)
		this.setPlayhead(time)
	}

	getPlayheadInMs() {
		return this.$playhead.value
	}

	playheadViewportX() {
		return this.viewport.timeToViewportX(this.$playhead.value)
	}

	zoomAnchor() {
		const x = this.playheadViewportX()
		return x >= 0 && x <= this.viewport.width
			? x
			: this.viewport.width / 2
	}

	splitAtPlayhead() {
		return this.splitSelectedItemAtTime(this.getPlayheadInMs())
	}

	splitSelectedItemAtTime(time: Ms) {
		const clipId = this.$selectedItem.value
		if (clipId === null)
			return

		this.splitClipAt(clipId, time)
	}

	splitClipAt(clipId: Id, time: Ms) {
		this.timeline.mutate(state => {
			const clip = this.index.getItem<Idx.Clip>(clipId)
			const parent = this.index.getParent(clipId)

			if (!parent)
				return

			const offset = ms(time - this.index.getItemLaneStart(clipId, this.$viewedItemId.value))
			if (offset <= 0 || offset >= clip.duration)
				return

			const id = () => this.deps.omnitool.getId()
			const leftId = id()
			const rightId = id()
			const {left, right} = splitClip(clip, leftId, rightId, offset)
			add(state, left)
			add(state, right)
			remove(state, clipId)

			if (parent.kind === Kind.Sequence) {
				update(state, parent.id, {
					childrenIds: replaceChild(parent.childrenIds, clipId, [leftId, rightId])
				})
				return
			}

			const seqId = id()
			const wrapped = wrapChildInSequence(parent, clipId, seqId, [leftId, rightId])
			add(state, wrapped.sequence)
			update(state, parent.id, wrapped.parent)
		})

		this.canvas.clearPreviews()
		this.$selectedItem.value = null
	}

	trimClip(clipId: Id, time: Ms, edge: 'start' | 'end') {
		this.timeline.mutate(state => {
			const clip = this.index.getItem<Idx.Clip>(clipId)
			const laneStart = this.index.getItemLaneStart(clipId, this.$viewedItemId.value)
			const mediaDuration = this.deps.resolveMedia(clip)?.duration
			update(state, clipId, trim(clip, edge, time - laneStart, mediaDuration))
		})
	}

	deleteClip(clipId: Id | null) {
		if (clipId === null)
			return

		this.timeline.mutate(state => {
			const parent = this.index.getParent(clipId)
			if (!parent)
				return

			const item = this.index.getItemMaybe<Item.Any>(clipId)
			if (item?.kind === Kind.Transition)
				this.#applyTransitionResize(state, item, 0, parent.childrenIds, parent.childrenIds.indexOf(clipId))

			remove(state, clipId)
			update(state, parent.id, {
				childrenIds: parent.childrenIds.filter(childId => childId !== clipId)
			})
		})

		if (this.$selectedItem.value === clipId)
			this.$selectedItem.value = null
		this.canvas.scheduleDraw()
	}
}
