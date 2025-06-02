
import {Domain} from "../../domain.js"

export class CompositorDomain extends Domain {
	state = {
		historical: {},
		nonHistorical: {},
	}

	action = {
		coolAction: () => {},
		coolAction2: () => {},
	}
}

