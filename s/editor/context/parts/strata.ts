
import {Chronicle, Trunk} from "@e280/strata"
import {TimelineFile, Id} from "@omnimedia/omnitool"

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
	chron: Chronicle<{
		timeline: TimelineFile
	}>
	settings: EditorSettingsState
	outliner: {
		roles: Role[]
		tags: Tag[]
		items: OutlinerItem[]
	}
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

	settings = this.trunk.branch(s => s.settings)
	files = this.trunk.branch(s => s.files)
	timeline = this.trunk.chronobranch(64, s => s.chron)
	outliner = this.trunk.branch(s => s.outliner)
}

