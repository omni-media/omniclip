
import {Domain} from "./domain.js"
import {MediaDomain} from "./domains/media.js"
import {getLolView} from "../dom/views/lol/view.js"
import {ItemsDomain} from "./domains/outline/items.js"
import {CargoController} from "../controllers/cargo.js"
import {CompositorDomain} from "./domains/outline/compositor.js"
import {getOmniMedia} from "../dom/components/omni-media/element.js"

export class Context {
	domains = Domain.consolidate({
		media: new MediaDomain(),
		outline: {
			items: new ItemsDomain(),
			compositor: new CompositorDomain(),
		}
	})

	controllers = {
		cargo: new CargoController(
			this.domains.media,
			this.domains.outline.items,
		),
	}

	readonly elements = {
		OmniMedia: getOmniMedia(this),
	}

	readonly views = {
		LolView: getLolView(this),
	}
}

