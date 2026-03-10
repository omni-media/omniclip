
import {ms} from "@omnimedia/omnitool/x/units/ms.js"
import {OmniSession} from "../ui/logic/session.js"
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
	session: OmniSession

	constructor(private requirements: Requirements) {
		this.session = new OmniSession({
			strata: requirements.strata,
			omnitool: requirements.omni,
		})
		requirements.strata.timeline.lens(s => s).on(() => console.log('123'))

		requirements.controllers.player.playback.onTick.on(() =>
			this.session.setPlayhead(ms(requirements.controllers.player.currentTime))
		)
	}

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

