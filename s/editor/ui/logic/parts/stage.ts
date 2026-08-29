
import {signal} from "@e280/strata"
import {Kimura} from "@omnimedia/kimura"
import {Id, Item, Kind, TimelineFile} from "@omnimedia/omnitool"
import {Container, FederatedPointerEvent, Ticker} from "pixi.js"
import {mat6ToTransform} from "@omnimedia/omnitool/x/timeline/utils/matrix.js"
import type {Transform, TransformAnimation} from "@omnimedia/omnitool/x/timeline/types.js"

import {OmniSession} from "../session.js"
import {add, update} from "./mutate.js"
import {Idx} from "./index.js"
import {
	ANIMATION_CHANNELS,
	cloneAnimation,
	setAnimationKeyframe,
} from "../../pages/project/tabbing/tabs/inspector/views/controls/keyframes/utils.js"

type StageItem = Idx.VideoItem | Item.Text

export class Stage {
	kimura

	compositor
	#viewerZoom = 1
	#ticker = new Ticker()
	#active: {id: Id, object: Container} | null = null
	#resizeObserver = new ResizeObserver(() => this.#render())
	$preserveAspectRatio = signal(true)

	constructor(private session: OmniSession) {
		this.compositor = session.deps.driver.compositor
		this.compositor.pixi.stage.sortableChildren = true
		this.kimura = new Kimura({stage: this.compositor.pixi.stage})
		this.$preserveAspectRatio.on(value => {this.kimura.preserveAspectRatio = value})

		this.kimura.stageWidth = this.compositor.pixi.renderer.width
		this.kimura.stageHeight = this.compositor.pixi.renderer.height

		this.#ticker.add(() => this.#render())
		this.#resizeObserver.observe(this.compositor.pixi.renderer.canvas)
		this.#wireSelection()
		this.#wirePointerEvents()
	}

	get activeObject() {
		const selected = this.session.$selectedItem()
		if (selected)
			return this.compositor.getActiveObject(selected)
	}

	resize(width: number, height: number) {
		this.session.deps.player.resize(width, height)
		this.kimura.stageWidth = width
		this.kimura.stageHeight = height
	}

	setViewerZoom(zoom: number) {
		this.#viewerZoom = zoom
		this.#render()
	}

	#render() {
		this.#scaleOverlayToViewport()
		this.compositor.pixi.renderer.render(this.compositor.pixi.stage)
	}

	#scaleOverlayToViewport() {
		const renderer = this.compositor.pixi.renderer
		const {clientWidth: width, clientHeight: height} = renderer.canvas
		if (width && height)
			this.kimura.setOverlayScale(
				Math.max(renderer.width / width, renderer.height / height) / this.#viewerZoom,
			)
	}

	/**
	 * Recalculates kimura bounds and redraws its wireframe
	 **/
	refresh() {
		const id = this.session.$selectedItem.value
		const object = id && this.compositor.getActiveObject(id)

		if (object)
			this.#activate({id, object})
		else
			this.#deactivate()

		this.#render()
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
		const spatial = this.session.index.getItemMaybe<Item.Spatial>(item.spatialId)

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
		const spatial = this.session.index.getItemMaybe<Item.Spatial>(spatialId)
		const animation = (item.animationIds ?? [])
			.map(id => this.session.index.getItemMaybe<Item.Animation>(id))
			.find(entry => entry?.anims.transform)

		if (!spatial)
			add(state, {
				crop,
				id: spatialId,
				enabled: true,
				kind: Kind.Spatial,
				transform: animation ? this.session.deps.omnitool.transform() : transform
			})
		else if (animation)
			update(state, spatialId, {crop, enabled: true})
		else
			update(state, spatialId, {transform, crop, enabled: true})

		if (animation)
			this.#saveAnimatedTransform(state, animation, item, transform)

		if (!item.spatialId)
			update(state, itemId, {spatialId})
	}

	#saveAnimatedTransform(
		state: TimelineFile,
		animation: Item.Animation,
		item: StageItem,
		transform: Transform,
	) {
		const nextAnimation = cloneAnimation(animation.anims.transform as TransformAnimation)
		const laneStart = this.session.index.getItemLaneStart(item.id, this.session.$viewedItemId.value)
		const localTime = Math.min(item.duration, Math.max(0, this.session.$playhead.value - laneStart))

		for (const {path} of ANIMATION_CHANNELS)
			setAnimationKeyframe(nextAnimation, path, transform, localTime)

		update(state, animation.id, {
			anims: {...animation.anims, transform: nextAnimation},
			enabled: true,
		} as Partial<Item.Animation>)
	}
}

