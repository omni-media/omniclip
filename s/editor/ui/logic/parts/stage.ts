
import {Kimura} from "@omnimedia/kimura"
import {Id, Item, Kind} from "@omnimedia/omnitool"
import {Container, FederatedPointerEvent, Ticker} from "pixi.js"
import {mat6ToTransform} from "@omnimedia/omnitool/x/timeline/utils/matrix.js"

import {OmniSession} from "../session.js"
import {add, update} from "./mutate.js"

export class Stage {
	kimura

	compositor
	#active: {id: Id, object: Container} | null = null

	constructor(private session: OmniSession) {
		this.compositor = session.deps.driver.compositor
		this.kimura = new Kimura({stage: this.compositor.pixi.stage})
		this.compositor.pixi.stage.sortableChildren = true

		const {compositor} = session.deps.driver
		const timeline = session.timeline

		const kimura = this.kimura
		const ticker = new Ticker()

		ticker.add(() => this.compositor.pixi.renderer.render(this.compositor.pixi.stage))

		const handlePointerUp = () => {
			if (!this.#active)
				return

			const {id: itemId, object} = this.#active
			const transform = mat6ToTransform(object.localTransform)

			timeline.mutate(state => {
				const item = session.index.getItem<Item.Video | Item.Text>(itemId)
				const spatialId = item.spatialId ?? session.deps.omnitool.getId()

				const existing = state.items.find(i => i.id === spatialId) as Item.Spatial | undefined

				existing
					? update(state, spatialId, {...existing, transform, enabled: true})
					: add(state, {id: spatialId, kind: Kind.Spatial, transform, enabled: true})

				if (!item.spatialId)
					update(state, itemId, {...item, spatialId})
			})

			ticker.stop()
		}

		const activate = ({id, object, event}: {id: Id, object: Container, event?: FederatedPointerEvent}) => {
			this.#active = {id, object}
			compositor.pixi.stage.addChild(kimura)
			kimura.group = [object]
			if (event)
				kimura.emit('pointerdown', event)
		}

		this.session.$selectedItem.on(id => {
			if (!id)
				return

			const object = this.compositor.getActiveObject(id)
			if (object)
				activate({id, object})
		})

		compositor.onPointerDown.on(({event, id, object}) => {
			this.session.$selectedItem(id)
			activate({id, object, event})
		})

		compositor.onDispose.on(({object}) => {
			if (kimura.group[0] === object) {
				compositor.pixi.stage.removeChild(kimura)
				this.#active = null
			}
		})

		compositor.pixi.stage.on("pointerdown", () => ticker.start())

		for (const evt of ['pointerup', 'pointerupoutside'] as const) {
			compositor.pixi.stage.on(evt, handlePointerUp)
		}

	}

	get activeObject() {
		const selected = this.session.$selectedItem()
		if (selected)
			return this.compositor.getActiveObject(selected)
	}
}

