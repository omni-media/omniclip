
import {collect} from "@e280/stz"
import {Datafile, Omni} from "@omnimedia/omnitool"
import {Cellar, MediaLibrary} from "@e280/quay"

import {Strata} from "../parts/strata.js"

export class CargoController {
	static async setup(strata: Strata, cellar: Cellar, project: Omni) {
		const editorLibrary = await MediaLibrary.open(`omniclip`, "/editor/workers/cellar.worker.bundle.min.js")
		const projectLibrary = await editorLibrary.scope(strata.projectId)
		return new this(strata, cellar, project, projectLibrary, editorLibrary)
	}

	constructor(
		public strata: Strata,
		public cellar: Cellar,
		public project: Omni,
		public projectLibrary: MediaLibrary,
		public editorLibrary: MediaLibrary
	) {}

	async loadMedia({hash, mime, label}: {hash: string; mime?: string | undefined; label: string}) {
		const {file} = await this.editorLibrary.cellar.load(hash)
		const {media} = await this.project.load({
			media: Datafile.make(new Blob([file], {type: mime}), {filename: label, hash}),
		})
		return media
	}

	async resolveMedia(hash: string) {
		try {
			return this.project.resources.require(hash)
		}
		catch {
			const item = this.editorLibrary.findByHash(hash)
			if (!item) throw new Error("The media file is no longer in the library.")
			const {mime, label} = item.specimen
			await this.loadMedia({hash, mime, label})
			return this.project.resources.require(hash)
		}
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
		this.projectLibrary.dispose()
		this.editorLibrary.dispose()
	}
}

