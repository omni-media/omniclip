import {Cellar} from "@e280/quay"
import {Driver, Omni, TimelineFile} from "@omnimedia/omnitool"

import {Strata} from "./strata.js"
import {hydrateProject} from "./hydration.js"
import {OmniSession} from "../../ui/logic/session.js"
import {CargoController} from "../controllers/cargo.js"
import {AssistantController} from "../controllers/assistant.js"
import {Keybindings} from "../controllers/input/keybindings.js"
import {TabManager} from "../../ui/logic/parts/tab-manager.js"

export type Requirements = Awaited<ReturnType<typeof setupRequirements>>

export async function setupRequirements(projectId: string) {
	const strata = await Strata.setup(projectId)
	const tabs = new TabManager()
	const cellar = await Cellar.opfs("files", "/editor/workers/cellar.worker.bundle.min.js")
	const driver = await Driver.setup({workerUrl: "/editor/workers/driver.worker.bundle.min.js"})
	const project = new Omni(driver)

	const cargo = await CargoController.setup(strata, cellar, project)
	await hydrateProject(cargo.projectLibrary, project, cellar, strata)

	const player = await project.playback(strata.timeline.state as TimelineFile)
	const session = new OmniSession({
		strata,
		player,
		driver,
		resolveMedia: item => "mediaHash" in item
			? project.resources.require(item.mediaHash)
			: null,
	})
	const controllers = {cargo, player, assistant: new AssistantController(session)}
	const keybindings = await Keybindings.setup(session)
	return {strata, controllers, tabs, keybindings, project, driver, session}
}
