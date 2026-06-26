
import {collect} from "@e280/stz"
import {Omni} from "@omnimedia/omnitool"
import {Cellar, MediaLibrary} from "@e280/quay"

import {Strata} from "../parts/strata.js"

export class CargoController {
	static async setup(strata: Strata, cellar: Cellar, project: Omni) {
		const mediaLibrary = await MediaLibrary.open(`omniclip:${strata.projectId}`)
		return new this(strata, cellar, project, mediaLibrary)
	}

	constructor(
		public strata: Strata,
		public cellar: Cellar,
		public project: Omni,
		public mediaLibrary: MediaLibrary
	) {}

	async loadMedia(hash: string) {
		const cask = await this.mediaLibrary.cellar.load(hash)
		return cask.file
	}

	async refresh() {
		await this.strata.files.mutate(async s => {
			s.hashes = await collect(this.cellar.list())
		})
	}

	async deleteFile(hash: string) {
		await this.cellar.delete(hash)
		await this.refresh()
	}

	dispose() {
		this.mediaLibrary.dispose()
	}
}

