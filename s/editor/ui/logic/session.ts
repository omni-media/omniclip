
import {signal} from "@e280/strata"
import {Id, Kind, O, VideoPlayer} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx, Index} from "./parts/index.js"
import {Viewport} from "./parts/viewport.js"
import {Tool} from "./parts/modes/tool.js"
import {selectTool} from "./parts/modes/select.js"
import {Strata} from "../../context/parts/strata.js"
import {add, remove, update} from "./parts/mutate.js"
import {PIXELS_PER_MILLISECOND} from "../pages/project/tabbing/tabs/edit/constants.js"
import {TimelineCanvas} from "../pages/project/tabbing/tabs/edit/canvas/canvas.js"

export class OmniSession {
	index

	$playhead = signal<Ms>(ms(0))
	$timeline = {
		scrollLeft: signal(0),
		width: signal(0)
	}

	$selectedItem = signal<Id | null>(null)
	$viewedItemId = signal<Id>(0)

	$zoom = signal(1)
	viewport = new Viewport(() =>
		PIXELS_PER_MILLISECOND * this.$zoom.value
	)

	canvas
	activeMode = signal(selectTool(this))

	constructor(public deps: {
		strata: Strata,
		omnitool: O,
		player: VideoPlayer
	}) {
		this.canvas = new TimelineCanvas({
			session: this,
			timeline: this.deps.strata.timeline,
			player: this.deps.player,
			settings: this.deps.strata.settings
		})
		this.index = new Index(deps.strata.timeline)
		this.$viewedItemId.value = deps.strata.timeline.state.rootId
	}

	get timeline() {
		return this.deps.strata.timeline
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

	getPlayheadInMs() {
		return this.$playhead.value
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

			const offset = time - this.index.getItemLaneStart(clipId, this.$viewedItemId.value)
			if (offset <= 0 || offset >= clip.duration)
				return

			const id = () => this.deps.omnitool.getId()
			const leftId = id()
			const rightId = id()

			let replacements = [leftId, rightId]

			if (parent.kind === Kind.Stack) {
				const seqId = id()
				add(state, {id: seqId, kind: Kind.Sequence, childrenIds: replacements})
				replacements = [seqId]
			}

			add(state, {...clip, id: leftId, duration: offset})
			add(state, {
				...clip,
				id: rightId,
				duration: clip.duration - offset,
				...(clip.kind !== Kind.Text && { start: (clip.start ?? 0) + offset })
			})
			remove(state, clipId)

			update(state, parent.id, {
				childrenIds: parent.childrenIds.flatMap(c =>
					c === clipId ? replacements : [c]
				)
			})
		})

		this.canvas.clearPreviews()
		this.$selectedItem.value = null
	}

	trimClip(clipId: Id, time: Ms, edge: 'start' | 'end') {
		this.timeline.mutate(state => {
			const clip = this.index.getItem<Idx.Clip>(clipId)
			const laneStart = this.index.getItemLaneStart(clipId, this.$viewedItemId.value)
			const offset = time - laneStart

			if (offset <= 0 || offset >= clip.duration)
				return

			update(state, clipId, edge === 'start'
				? {
					duration: clip.duration - offset,
					...(clip.kind !== Kind.Text && {start: (clip.start ?? 0) + offset})
				}
				: {duration: offset}
				)
		})
	}

	deleteClip(clipId: Id) {
		this.timeline.mutate(state => {
			const parent = this.index.getParent(clipId)
			if (!parent)
				return

			remove(state, clipId)
			update(state, parent.id, {
				childrenIds: parent.childrenIds.filter(id => id !== clipId)
			})
		})

		if (this.$selectedItem.value === clipId)
			this.$selectedItem.value = null
	}
}
