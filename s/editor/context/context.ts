
import {ms} from "@omnimedia/omnitool/x/units/ms.js"

import {makeRouter} from "../ui/pages/router.js"
import {prepareViews} from "../ui/views/views.js"
import {ModalManager} from "./parts/modal/modal.js"
import {Requirements, setupRequirements} from "./parts/requirements.js"

export class EditorContext {
	static async setup() {
		const requirements = await setupRequirements()
		return new this(requirements)
	}

	router = makeRouter(this)
	views = prepareViews(this)
	modals = new ModalManager(this)

	constructor(private requirements: Requirements) {

		requirements.controllers.player.playback.onTick.on(() =>
			this.session.setPlayhead(ms(requirements.controllers.player.currentTime))
		)
	}

	get session() { return this.requirements.session }
	get strata() { return this.requirements.strata }
	get controllers() { return this.requirements.controllers }
	get omni() { return this.requirements.omni }
	get project() { return this.requirements.project }
	get driver() { return this.requirements.driver }
	get tabs() {return this.requirements.tabs}

	dispose = () => {
		this.requirements.keybindings.dispose()
	}
}

