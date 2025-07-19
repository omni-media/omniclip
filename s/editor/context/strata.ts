
import {Chronicle, Trunk} from "@e280/strata"

export type State = {
	files: {
		hashes: string[]
	}
	chron: Chronicle<{
		timeline: {}
	}>
}

export class Strata {
	trunk = new Trunk<State>({
		files: {
			hashes: [],
		},
		chron: Trunk.chronicle({
			timeline: {},
		}),
	})

	files = this.trunk.branch(s => s.files)
	timeline = this.trunk.chronobranch(64, s => s.chron)
}

