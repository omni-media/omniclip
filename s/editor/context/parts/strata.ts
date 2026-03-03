
import {Chronicle, Trunk} from "@e280/strata"
import {TimelineFile} from "@omnimedia/omnitool"

export type EditorUIState = {
	timelineScrollLeft: number
	timelineWidth: number
}

export type EditorSettingsState = {
	timebase: number
	zoom: number
	resolution: {
		width: number
		height: number
	}
}

export type State = {
	files: {
		hashes: string[]
	}
	chron: Chronicle<{
		timeline: TimelineFile
	}>
	settings: EditorSettingsState
	outliner: {
		starred: number[]
	}
	viewedItemId: {id: number}
	selectedItem: {id: number | null}
	ui: EditorUIState
}

export class Strata {
	trunk = new Trunk<State>({
		files: {
			hashes: [],
		},
		chron: Trunk.chronicle({
			timeline: {
				info: "https://omniclip.app/",
				format: "timeline",
				version: 0,
				rootId: 1,
				items: []
			}
		}),
		outliner: {
			starred: [4]
		},
		selectedItem: {id: null},
		viewedItemId: {id: 3},
		settings: {
			timebase: 30,
			zoom: 1,
			resolution: {
				width: 1920,
				height: 1080
			}
		},
		ui: {
			timelineScrollLeft: 0,
			timelineWidth: 0
		}
	})

	settings = this.trunk.branch(s => s.settings)
	files = this.trunk.branch(s => s.files)
	timeline = this.trunk.chronobranch(64, s => s.chron)
	viewedItemId = this.trunk.branch(s => s.viewedItemId)
	selectedItem = this.trunk.branch(s => s.selectedItem)
	outliner = this.trunk.branch(s => s.outliner)
	ui = this.trunk.branch(s => s.ui)
}

