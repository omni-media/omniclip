
import {getLolView} from "../views/lol/view.js"
import {getOmniMedia} from "../components/omni-media/element.js"

export class Context {
	state = {}

	readonly elements = {
		OmniMedia: getOmniMedia(this),
	}

	readonly views = {
		LolView: getLolView(this),
	}
}

