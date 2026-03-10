
import {TimelineFile, Id} from "@omnimedia/omnitool"
import {Chronicle, chronicle, Prism, Chrono} from "@e280/strata"

export type EditorSettingsState = {
	timebase: number
	resolution: {
		width: number
		height: number
	}
}

export type RoleScope = "video" | "audio" | "text" | "global"

export type Role = {
	id: Id
	key: string
	name: string
	scope: RoleScope
	color: string
	parentRoleId?: Id
	enabled: boolean
}

export type Tag = {
	id: Id
	name: string
	color: string
}

export type OutlinerItem = {
	itemId: Id
	roleIds: Id[]
	tagIds: Id[]
	starred: boolean
}

export type State = {
	files: {
		hashes: string[]
	}
	timeline: Chronicle<TimelineFile>
	settings: EditorSettingsState
	outliner: {
		roles: Role[]
		tags: Tag[]
		items: OutlinerItem[]
	}
}

export class Strata {
	trunk = new Prism<State>({
		files: {
			hashes: [],
		},
		timeline: chronicle({
			info: "https://omniclip.app/",
			format: "timeline",
			version: 0,
			rootId: 1,
			items: []
		}),
		outliner: {
			roles: [],
			tags: [],
			items: []
		},
		settings: {
			timebase: 30,
			resolution: {
				width: 1920,
				height: 1080
			}
		},
	})

	settings = this.trunk.lens(s => s.settings)
	files = this.trunk.lens(s => s.files)
	timeline = new Chrono(64, this.trunk.lens(state => state.timeline))
	outliner = this.trunk.lens(s => s.outliner)
}

