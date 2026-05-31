import {Cellar, OpfsForklift} from "@e280/quay"
import {Datafile, Driver, Kind, Media, O, Omni, TimelineFile} from "@omnimedia/omnitool"

import {Strata} from "./strata.js"
import {OmniSession} from "../../ui/logic/session.js"
import {CargoController} from "../controllers/cargo.js"
import {Keybindings} from "../controllers/input/keybindings.js"
import {TabManager} from "../../ui/logic/parts/tab-manager.js"
export type Requirements = Awaited<ReturnType<typeof setupRequirements>>

export async function setupRequirements(projectId = Strata.defaultProjectId) {
	const strata = await Strata.setup(projectId)
	const tabs = new TabManager()
	const forklift = await OpfsForklift.setup("files")
	const cellar = new Cellar(forklift)
	const driver = await Driver.setup()
	const project = new Omni(driver)
	const videoA = await loadDemoFiles(project)

	if (strata.timeline.state.items.length === 1)
		await demo(strata, project, videoA)

	const player = await project.playback(strata.timeline.state as TimelineFile)
	const controllers = {cargo: new CargoController(strata, cellar), player}
	const omni = new O({
		get timeline() {
			return strata.timeline.state
		},
		set timeline(p: TimelineFile) {
			strata.timeline.mutate(state => Object.assign(state, p))
		}
	})
	const session = new OmniSession({
		strata,
		omnitool: omni,
		player,
		driver,
		resolveMedia: item => "mediaHash" in item
			? project.resources.require(item.mediaHash)
			: null,
	})
	const keybindings = await Keybindings.setup(session)
	return {strata, controllers, tabs, keybindings, omni, project, driver, session}
}

async function loadDemoFiles(omni: Omni) {
	const demoVideo = await fetch("/assets/temp/gl.mp4")
	const blob = await demoVideo.blob()
	const {videoA} = await omni.load({videoA: Datafile.make(blob)})
	return videoA
}

async function demo(strata: Strata, omni: Omni, videoA: Media) {
	await strata.timeline.mutate(state => Object.assign(state,
		omni.timeline(o =>
			o.stack(
				o.text("text123", {styles: {fill: "red"}}),
				o.video(videoA, {duration: 5000}),
				o.audio(videoA, {duration: 8000}),
			)
		)
	))
	const stack = strata.timeline.state.items.find(item => item.kind === Kind.Stack)
	await strata.timeline.mutate(state => state.rootId = stack!.id)
}
