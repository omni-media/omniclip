
import {Kimura} from "@omnimedia/kimura"
import {Id, Item, Kind, TimelineFile} from "@omnimedia/omnitool"
import {Container, FederatedPointerEvent, Ticker} from "pixi.js"
import type {Transform} from "@omnimedia/omnitool/x/timeline/types.js"
import {mat6ToTransform} from "@omnimedia/omnitool/x/timeline/utils/matrix.js"

import {OmniSession} from "../session.js"
import {add, update} from "./mutate.js"
import {
	ANIMATION_CHANNELS,
	cloneAnimation,
	setAnimationKeyframe,
} from "../../pages/project/tabbing/tabs/inspector/views/controls/animations/utils.js"

type StageItem = Item.Video | Item.Text
type SpatialItem = Item.Spatial | Item.AnimatedSpatial

export class Stage {
	kimura

	compositor
	#active: {id: Id, object: Container} | null = null
	#ticker = new Ticker()

	constructor(private session: OmniSession) {
		this.compositor = session.deps.driver.compositor
		this.kimura = new Kimura({stage: this.compositor.pixi.stage})
		this.compositor.pixi.stage.sortableChildren = true

		this.kimura.stageWidth = this.compositor.pixi.renderer.width
		this.kimura.stageHeight = this.compositor.pixi.renderer.height

		this.#ticker.add(() => this.#render())
		this.#wireSelection()
		this.#wirePointerEvents()
	}

	get activeObject() {
		const selected = this.session.$selectedItem()
		if (selected)
			return this.compositor.getActiveObject(selected)
	}

	set width(width: number) {
		this.compositor.pixi.stage.width = width
		this.kimura.stageWidth = width
	}

	set height(height: number) {
		this.compositor.pixi.stage.height = height
		this.kimura.stageHeight = height
	}

	#render() {
		this.compositor.pixi.renderer.render(this.compositor.pixi.stage)
	}

	#wireSelection() {
		this.session.$selectedItem.on(id => {
			if (!id)
				return

			const object = this.compositor.getActiveObject(id)
			if (object)
				this.#activate({id, object})
		})
	}

	#wirePointerEvents() {
		this.compositor.onPointerDown.on(({event, id, object}) => {
			this.session.$selectedItem(id)
			this.#activate({id, object, event})
		})

		this.compositor.onDispose.on(({object}) => {
			if (this.kimura.group[0] === object)
				this.#deactivate()
		})

		this.compositor.pixi.stage.on("pointerdown", () => this.#ticker.start())

		for (const evt of ['pointerup', 'pointerupoutside'] as const)
			this.compositor.pixi.stage.on(evt, () => this.#commitActiveTransform())
	}

	#activate({id, object, event}: {id: Id, object: Container, event?: FederatedPointerEvent}) {
		this.#active = {id, object}

		const item = this.session.index.getItem<StageItem>(id)
		const spatial = item.spatialId
			? this.session.index.getItem<SpatialItem>(item.spatialId)
			: null

		this.compositor.pixi.stage.addChild(this.kimura)
		this.kimura.group = [object]
		this.kimura.crop = spatial?.crop ?? [0, 0, 0, 0]

		if (event)
			this.kimura.emit('pointerdown', event)
	}

	#deactivate() {
		this.kimura.group = []
		this.compositor.pixi.stage.removeChild(this.kimura)
		this.#active = null
	}

	#commitActiveTransform() {
		if (!this.#active)
			return

		const {id, object} = this.#active
		const transform = mat6ToTransform(object.localTransform)
		const crop = this.kimura.crop

		this.session.timeline.mutate(state => this.#saveTransform(state, id, transform, crop))
		this.#render()
		this.#ticker.stop()
	}

	#saveTransform(state: TimelineFile, itemId: Id, transform: Transform, crop: Item.Spatial["crop"]) {
		const item = this.session.index.getItem<StageItem>(itemId)
		const spatialId = item.spatialId ?? this.session.deps.omnitool.getId()
		const spatial = state.items.find(i => i.id === spatialId) as SpatialItem | undefined

		if (!spatial)
			add(state, {id: spatialId, kind: Kind.Spatial, transform, crop, enabled: true})
		else if (spatial.kind === Kind.AnimatedSpatial)
			this.#saveAnimatedTransform(state, spatial, item, transform, crop)
		else
			update(state, spatialId, {transform, crop, enabled: true})

		if (!item.spatialId)
			update(state, itemId, {spatialId})
	}

	#saveAnimatedTransform(
		state: TimelineFile,
		spatial: Item.AnimatedSpatial,
		item: StageItem,
		transform: Transform,
		crop: Item.Spatial["crop"],
	) {
		const nextAnimation = cloneAnimation(spatial.anim)
		const laneStart = this.session.index.getItemLaneStart(item.id, this.session.$viewedItemId.value)
		const localTime = Math.min(item.duration, Math.max(0, this.session.$playhead.value - laneStart))

		for (const {path} of ANIMATION_CHANNELS)
			setAnimationKeyframe(nextAnimation, path, transform, localTime)

		update(state, spatial.id, {anim: nextAnimation, crop, enabled: true} as Partial<Item.AnimatedSpatial>)
	}
}

