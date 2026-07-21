import {Cellar} from "@e280/quay"
import {Driver, O, Omni, TimelineFile} from "@omnimedia/omnitool"

import {Strata} from "./strata.js"
import {hydrateProject} from "./hydration.js"
import {OmniSession} from "../../ui/logic/session.js"
import {CargoController} from "../controllers/cargo.js"
import {Keybindings} from "../controllers/input/keybindings.js"
import {TabManager} from "../../ui/logic/parts/tab-manager.js"

export type Requirements = Awaited<ReturnType<typeof setupRequirements>>

export async function setupRequirements(projectId: string) {
	const strata = await Strata.setup(projectId)
	const tabs = new TabManager()
	const cellar = await Cellar.opfs("files")
	const driver = await Driver.setup()
	const project = new Omni(driver)

	const cargo = await CargoController.setup(strata, cellar, project)
	await hydrateProject(cargo.mediaLibrary, project, cellar, strata)

	const player = await project.playback(strata.timeline.state as TimelineFile)
	const controllers = {cargo, player}
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
