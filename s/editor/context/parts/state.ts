
import {chronicle, Chronicle} from "@e280/strata"
import {Id, Kind, TimelineFile} from "@omnimedia/omnitool"

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

export const defaultRoles: Role[] = [
	{id: -1, key: "video", name: "Video", scope: "video", color: "#4c8fd6", enabled: true},
	{id: -2, key: "titles", name: "Titles", scope: "text", color: "#caa458", enabled: true},
	{id: -3, key: "dialogue", name: "Dialogue", scope: "audio", color: "#65a66f", enabled: true},
	{id: -4, key: "music", name: "Music", scope: "audio", color: "#b083d4", enabled: true},
	{id: -5, key: "effects", name: "Effects", scope: "global", color: "#d67855", enabled: true},
]

export function defaultRoleKeysFor(kind: Kind) {
	switch (kind) {
		case Kind.Video:
		case Kind.Image:
			return ["video"]
		case Kind.Text:
		case Kind.Caption:
			return ["titles"]
		case Kind.Audio:
			return ["dialogue"]
		case Kind.Transition:
			return ["effects"]
		default:
			return []
	}
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

