
import {is} from "@e280/stz"
import {signal} from "@e280/strata"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"
import {Driver, Id, Item, Kind, O, Resource, TimelineFile, VideoPlayer} from "@omnimedia/omnitool"

import {Idx, Index} from "./parts/index.js"
import {Viewport} from "./parts/viewport.js"
import {Tool} from "./parts/modes/tool.js"
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
		this.#index = new Index(deps.strata.timeline.state as TimelineFile)
		deps.strata.timeline.lens(s => s).on(s => this.#index.reindex(s as TimelineFile))
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
