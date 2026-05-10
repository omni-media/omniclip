
import {is} from "@e280/stz"
import {signal} from "@e280/strata"
import {visualAnimations} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"
import type {Transform, TransformAnimation} from "@omnimedia/omnitool/x/timeline/types.js"
import {Driver, Id, Item, Kind, O, Resource, TimelineFile, VideoPlayer} from "@omnimedia/omnitool"

import {Stage} from "./parts/stage.js"
import {Tool} from "./parts/modes/tool.js"
import {Idx, Index} from "./parts/index.js"
import {Viewport} from "./parts/viewport.js"
import {selectTool} from "./parts/modes/select.js"
import {Strata} from "../../context/parts/strata.js"
import {add, remove, update} from "./parts/mutate.js"
import {Proposal} from "./parts/proposal/proposal.js"
import {trim} from "./parts/interactions/trim/parts/action.js"
import {DropIntent} from "./parts/interactions/drag/parts/intent.js"
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
		this.#index = new Index(deps.strata.timeline.state as TimelineFile)
		this.$viewedItemId.value = deps.strata.timeline.state.rootId

		this.$ghostPlayhead.on(time => {
			if(!this.deps.player.isPlaying) {
				if(is.happy(time))
					this.deps.player.seek(time)
				else
					this.deps.player.seek(this.$playhead())
			}
		})
	}

	// TODO: refactor this by moving it to new selector class instead
	reconcile(timeline: TimelineFile) {
		this.#index.reindex(timeline)

		if (!this.#index.getItemMaybe(this.$viewedItemId.value))
			this.$viewedItemId.value = timeline.rootId

		const selectedItemId = this.$selectedItem.value
		if (selectedItemId !== null && !this.#index.getItemMaybe(selectedItemId))
			this.$selectedItem.value = null

		this.clearProposal()
		this.canvas.clearPreviews()
		this.canvas.scheduleDraw()
	}

	get timeline() {
		return this.deps.strata.timeline
	}

	get index() {
		return this.$proposal.value?.index ?? this.#index
	}

	setProposal(proposal: Proposal | null) {
		this.$proposal.value = proposal
	}

	clearProposal() {
		this.$proposal.value = null
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
		this.$playhead.set(time)
	}

	setGhostPlayhead(time: Ms | null) {
		this.$ghostPlayhead.set(time)
	}

	clearGhostPlayhead() {
		this.$ghostPlayhead.set(null)
	}

	updateTransformAnimation(
		item: Item.Text | Item.Video,
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

			remove(state, clipId)
			update(state, parent.id, {
				childrenIds: parent.childrenIds.filter(childId => childId !== clipId)
			})
		})

		if (this.$selectedItem.value === clipId)
			this.$selectedItem.value = null
	}
}
