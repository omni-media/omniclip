
import type {TimelinePatch} from "@omnimedia/omniso/timeline"

import type {EditorContext} from "../../../../../../context/context.js"

export async function ensureMedia(context: EditorContext, patch: TimelinePatch) {
	const hashes = new Set<string>()
	for (const operation of patch.operations) {
		if ("item" in operation && "mediaHash" in operation.item)
			hashes.add(operation.item.mediaHash)
	}

	const {cargo} = context.controllers
	const {editorLibrary, projectLibrary} = cargo
	for (const hash of hashes) {
		await cargo.resolveMedia(hash)
		if (!projectLibrary.findByHash(hash) && editorLibrary.findByHash(hash))
			await projectLibrary.include(hash)
	}
}

