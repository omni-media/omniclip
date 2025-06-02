
import {Domain} from "../../domain.js"

export class ItemsDomain extends Domain {
	state = {
		historical: {},
		nonHistorical: {},
	}

	action = {
		coolAction: () => {},
		coolAction2: () => {},
	}
}

