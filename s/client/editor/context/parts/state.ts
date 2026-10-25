
import {hex} from "@e280/stz"
import {chronicle, Chronicle} from "@e280/strata"
import type {Settings} from "@omnimedia/omniso/settings"
import {Id, Kind, TimelineFile} from "@omnimedia/omnitool"

export type Tag = {
	id: Id
	name: string
	color: string
}

export type OutlinerItem = {
	itemId: Id
	tagIds: Id[]
	starred: boolean
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
		tags: Tag[]
		items: OutlinerItem[]
	}
}
const makeDefaultTimeline = (withRoot = false): TimelineFile => {
	const rootId = hex.random(16)
	return {
		info: "https://omniclip.app/",
		format: "timeline",
		version: 1,
		rootId,
		items: withRoot
			? [{id: rootId, kind: Kind.Stack, childrenIds: []}]
			: []
	}
}

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

