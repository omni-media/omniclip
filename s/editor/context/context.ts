
import {OmniCore} from "../ui/logic/core.js"
import {makeRouter} from "../ui/pages/router.js"
import {prepareViews} from "../ui/views/views.js"
import {Requirements, setupRequirements} from "./parts/requirements.js"

export class EditorContext {
	static async setup() {
		const requirements = await setupRequirements()
		return new this(requirements)
	}

	router = makeRouter(this)
	views = prepareViews(this)
	omnicore: OmniCore

	constructor(private requirements: Requirements) {
		this.omnicore = new OmniCore(this)
	}

	get strata() { return this.requirements.strata }
	get controllers() { return this.requirements.controllers }
	get omni() { return this.requirements.omni }
	get project() { return this.requirements.project }
	get driver() { return this.requirements.driver }

	dispose = () => {
		this.requirements.keybindings.dispose()
	}
}

