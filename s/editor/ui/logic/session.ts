
import {signal} from "@e280/strata"
import {Id, Kind, O} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx, Index} from "./parts/index.js"
import {add, remove, update} from "./parts/mutate.js"
import {Strata} from "../../context/parts/strata.js"

export class OmniSession {
	index

	$playhead = signal(0)
	$timeline = {
		scrollLeft: signal(0),
		width: signal(0)
	}

	$selectedItem = signal<Id | null>(null)
	$viewedItemId = signal<Id>(0)

	$zoom = signal(1)

	constructor(private deps: {
		strata: Strata,
		omnitool: O
	}) {
		this.index = new Index(deps.strata.timeline)
		this.$viewedItemId.value = deps.strata.timeline.state.rootId
	}

	get timeline() {
		return this.deps.strata.timeline
	}

	setPlayhead(time: Ms) {
		this.$playhead.set(time)
	}

	getPlayheadInMs() {
		return ms(this.$playhead.value)
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
