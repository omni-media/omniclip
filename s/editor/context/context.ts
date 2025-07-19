
import {Cellar, OpfsForklift} from "@e280/quay"
import {Strata} from "./strata.js"
import {getLolView} from "../dom/views/lol/view.js"
import {CargoController} from "./controllers/cargo.js"
import {getOmniMedia} from "../dom/components/omni-media/element.js"

export class EditorContext {
	static async setup() {
		const requirements = await setupRequirements()
		return new this(requirements)
	}

	constructor(private requirements: Requirements) {}

	get strata() {
		return this.requirements.strata
	}

	get controllers() {
		return this.requirements.controllers
	}

	views = {
		LolView: getLolView(this),
	}

	getElements = () => ({
		OmniMedia: getOmniMedia(this),
	})
}

type Requirements = Awaited<ReturnType<typeof setupRequirements>>

async function setupRequirements() {
	const strata = new Strata()
	const forklift = await OpfsForklift.setup("files")
	const cellar = new Cellar(forklift)
	const controllers = {
		cargo: new CargoController(strata, cellar),
	}
	return {strata, controllers}
}

