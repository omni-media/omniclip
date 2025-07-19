
import {Cellar, OpfsForklift} from "@e280/quay"
import {Strata} from "./strata.js"
import {getLolView} from "../dom/views/lol/view.js"
import {CargoController} from "./controllers/cargo.js"
import {getOmniMedia} from "../dom/components/omni-media/element.js"

export class EditorContext {
	static async setup() {
		const requirements = await setupRequirements()
		const controllers = setupControllers(requirements)
		return new this(requirements, controllers)
	}

	constructor(
		private requirements: Requirements,
		public controllers: Controllers,
	) {}

	get strata() {
		return this.requirements.strata
	}

	views = {
		LolView: getLolView(this),
	}

	getElements = () => ({
		OmniMedia: getOmniMedia(this),
	})
}

type Requirements = Awaited<ReturnType<typeof setupRequirements>>
type Controllers = ReturnType<typeof setupControllers>

async function setupRequirements() {
	const strata = new Strata()
	const forklift = await OpfsForklift.setup("files")
	const cellar = new Cellar(forklift)
	return {strata, cellar}
}

function setupControllers(r: Requirements) {
	return {
		cargo: new CargoController(r.strata, r.cellar),
	}
}

