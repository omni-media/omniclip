
import {Cellar, OpfsForklift} from "@e280/quay"
import {Datafile, Driver, Kind, O, Omni, TimelineFile} from "@omnimedia/omnitool"

import {Strata} from "./strata.js"
import {CargoController} from "../controllers/cargo.js"
import {Keybindings} from "../controllers/input/keybindings.js"
import {TabManager} from "../../ui/logic/parts/tab-manager.js"

export type Requirements = Awaited<ReturnType<typeof setupRequirements>>

export async function setupRequirements() {
	const strata = new Strata()
	const tabs = new TabManager()
	const keybindings = await Keybindings.setup(tabs)
	const forklift = await OpfsForklift.setup("files")
	const cellar = new Cellar(forklift)
	const driver = await Driver.setup()
	const project = new Omni(driver)
	await demo(strata, project)
	const player = await project.playback(strata.timeline.state as TimelineFile)
	const controllers = {cargo: new CargoController(strata, cellar), player}
	const omni = new O({
		get timeline() {
			return strata.timeline.state as TimelineFile
		},
		set timeline(p: TimelineFile) {
			strata.timeline.mutate(state => Object.assign(state, p))
		}
	})
	strata.timeline.lens(s => s).on(state => player.update(state as TimelineFile))
	return {strata, controllers, tabs, keybindings, omni, project, driver}
}

async function demo(strata: Strata, omni: Omni) {
	const demoVideo = await fetch("/assets/temp/gl.mp4")
	const blob = await demoVideo.blob()
	const {videoA} = await omni.load({videoA: Datafile.make(blob)})
	await strata.timeline.mutate(state => Object.assign(state,
		omni.timeline(o =>
			o.sequence(
				o.stack(
					o.text("text123"),
					o.video(videoA, {duration: 5000}),
					o.audio(videoA, {duration: 8000}),
				),
				o.video(videoA, {duration: 7000})
			))
	))
	const stack = strata.timeline.state.items.find(item => item.kind === Kind.Stack)
	await strata.outliner.mutate(
		state => state.items = strata
			.timeline.state.items
			.map(item => ({itemId: item.id, starred: false, tagIds: [], roleIds: []}))
	)
	await strata.timeline.mutate(state => state.rootId = stack!.id)
}
