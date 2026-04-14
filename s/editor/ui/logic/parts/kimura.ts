
import {Container, Ticker} from "pixi.js"
import {Kimura} from "@omnimedia/kimura"
import {Id, Item, Kind} from "@omnimedia/omnitool"
import {mat6ToTransform} from "@omnimedia/omnitool/x/timeline/utils/matrix.js"

import {add, update} from "./mutate.js"
import {OmniSession} from "../session.js"
export function setupKimura(session: OmniSession) {
	const {compositor} = session.deps.driver
	const timeline = session.timeline

	const ticker = new Ticker()
	ticker.add(() => compositor.pixi.renderer.render(compositor.pixi.stage))

	const kimura = new Kimura({group: []})

	let active: {id: Id, object: Container} | null = null

	const handlePointerUp = () => {
		if (!active)
			return

		const {id: itemId, object} = active
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
	}

	compositor.onPointerDown.on(({event, id, object}) => {
		active = {id, object}
		kimura.group = [object]
		kimura.emit('pointerdown', event)
		compositor.pixi.stage.addChild(kimura)
	})

	kimura.on('pointerdown', () => ticker.start())
	kimura.on('pointerup', () => ticker.stop())

	compositor.onDispose.on(({object}) => {
		if (kimura.group[0] === object) {
			compositor.pixi.stage.removeChild(kimura)
		}
	})

	for (const evt of ['pointerup', 'pointerupoutside'] as const) {
		compositor.pixi.stage.on(evt, handlePointerUp)
	}

	return kimura
}

