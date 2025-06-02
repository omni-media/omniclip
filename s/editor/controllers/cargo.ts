
import {MediaDomain} from "../context/domains/media.js"
import {ItemsDomain} from "../context/domains/outline/items.js"

export class CargoController {
	constructor(
		public media: MediaDomain,
		public items: ItemsDomain,
	) {}

	async deleteFile() {
		await this.media.actions.deleteFile()
	}
}

