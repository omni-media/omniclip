
import {Cellar} from "@e280/quay"
import {Datafile, Kind, Omni} from "@omnimedia/omnitool"

import {Strata} from "./strata.js"
import type {CargoController} from "../controllers/cargo.js"

export async function hydrateProject(
	cargo: CargoController,
	omni: Omni,
	cellar: Cellar,
	strata: Strata
) {
	for await (const record of cargo.projectLibrary.records())
		await cargo.loadMedia(record)

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


