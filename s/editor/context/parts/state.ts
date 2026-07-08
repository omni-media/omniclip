
import {chronicle, Chronicle} from "@e280/strata"
import {Id, Kind, TimelineFile} from "@omnimedia/omnitool"

import {defaultRoles} from "./roles/defaults.js"

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
	roleId: Id
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

export type ItemMetadata = {
	itemId: Id
	bgRemoved?: boolean
}

export type Metadata = {
	items: ItemMetadata[]
}

export type State = {
	updatedAt: number
	files: {
		hashes: string[]
	}
	metadata: Metadata
	timeline: Chronicle<TimelineFile>
	settings: Settings
	outliner: {
		roles: Role[]
		tags: Tag[]
		items: OutlinerItem[]
	}
}
const makeDefaultTimeline = (withRoot = false): TimelineFile => ({
	info: "https://omniclip.app/",
	format: "timeline",
	version: 0,
	rootId: 1,
	items: withRoot
		? [{
			id: 1,
			kind: Kind.Stack,
			childrenIds: []
		}]
		: []
})

export const makeDefaultState = (withRoot = false): State => ({
	updatedAt: Date.now(),
	files: {
		hashes: [],
	},
	metadata: {
		items: []
	},
	timeline: chronicle(makeDefaultTimeline(withRoot)),
	outliner: {
		roles: defaultRoles.map(role => ({...role})),
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

