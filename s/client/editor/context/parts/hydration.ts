
import {Cellar, MediaLibrary} from "@e280/quay"
import {Datafile, Kind, Omni} from "@omnimedia/omnitool"

import {Strata} from "./strata.js"

export async function hydrateProject(
	library: MediaLibrary,
	omni: Omni,
	cellar: Cellar,
	strata: Strata
) {
// hydrate omnitool using quay media
	for await (const record of library.records()) {
		const cask = await library.cellar.load(record.hash)
		await omni.load({
			media: Datafile.make(new Blob([cask.file], {type: record.mime}), {
				filename: record.label,
				hash: record.hash
			}),
		})
	}

	// hydrate saved bg remover images for omnitool to use
	for (const meta of strata.trunk.get().metadata.items.filter(item => item.bgRemoved)) {
		const item = strata.timeline.state.items.find(item => item.id === meta.itemId)
		const image = item?.kind === Kind.Image
			? item
			: undefined

		if (!image)
			continue

		const cask = await cellar.load(image.mediaHash)
		await omni.load({
			[image.mediaHash]: Datafile.make(new Blob([cask.file], {type: "image/png"}), {
				filename: `${image.mediaHash}.png`,
				hash: image.mediaHash
			}),
		})
	}
}


