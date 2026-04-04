
import {TimelineFile, Id} from "@omnimedia/omnitool"
import {Chronicle, chronicle, Prism, Chrono} from "@e280/strata"

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

export type Settings = {
	resolution: string
	timebase: number
	dropFrame: boolean
	aspectRatio: "16:9" | "9:16" | "1:1" | "3:2" | "4:3" | "21:9"
	colorSpace: "rec709" | "displayp3" | "rec2020"
	sampleRate: "48000" | "44100" | "96000"
	channels: "stereo" | "mono" | "5.1 Surround"
}

export type State = {
	files: {
		hashes: string[]
	}
	timeline: Chronicle<TimelineFile>
	settings: Settings
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
			dropFrame: true,
			timebase: 30,
			resolution: "1920x1080",
			channels: "stereo",
			colorSpace: "rec709",
			aspectRatio: "16:9",
			sampleRate: "48000",
		},
	})

	settings = this.trunk.lens(s => s.settings)
	files = this.trunk.lens(s => s.files)
	timeline = new Chrono(64, this.trunk.lens(state => state.timeline))
	outliner = this.trunk.lens(s => s.outliner)
}

