
import {signal} from "@e280/strata"
import {Id, Item, Kind, O} from "@omnimedia/omnitool"
import {ms, Ms} from "@omnimedia/omnitool/x/units/ms.js"

import {Idx, Index} from "./parts/index.js"
import {add, remove} from "./parts/mutate.js"
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

			const offset = time - this.index.getItemStart(clipId, this.$viewedItemId.value)
			if (offset <= 0 || offset >= clip.duration)
				return

			const id = () => this.deps.omnitool.getId()

			const left = {
				...clip,
				id: id(),
				duration: offset
			}

			const right = {
				...clip,
				id: id(),
				...(clip.kind !== Kind.Text && { start: (clip.start ?? 0) + offset }),
				duration: clip.duration - offset
			}

			const p = state.items.find(i => i.id === parent.id) as Idx.Struct
			const i = p.childrenIds.indexOf(clipId)
			if (i === -1)
				return

			remove(state, clipId)
			add(state, left)
			add(state, right)

			if (p.kind === Kind.Sequence)
				p.childrenIds.splice(i, 1, left.id, right.id)
			else {
				const seq: Item.Sequence = {
					id: id(),
					kind: Kind.Sequence,
					childrenIds: [left.id, right.id]
				}
				add(state, seq)
				p.childrenIds[i] = seq.id
			}
		})
	}
}

