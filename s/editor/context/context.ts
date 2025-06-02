
import {getOmniMedia} from "../components/omni-media/element.js"

export class Context {
	state = {}

	getElements() {
		return {
			OmniMedia: getOmniMedia(this),
		}
	}
}

