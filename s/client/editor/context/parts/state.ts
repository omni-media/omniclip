
import {hex} from "@e280/stz"
import {chronicle, Chronicle} from "@e280/strata"
import type {Settings} from "@omnimedia/omniso/settings"
import {Id, Kind, TimelineFile} from "@omnimedia/omnitool"

import type {Tag, TagAssignment} from "./tags/types.js"
import type {Rule, RuleAssignment} from "./rules/types.js"

export type ItemMetadata = {
	itemId: Id
	bgRemoved?: boolean
}

export type Metadata = {
	items: ItemMetadata[]
}

export type OutlinerState = {
	tags: Tag[]
	tagAssignments: TagAssignment[]
	rules: Rule[]
	ruleAssignments: RuleAssignment[]
}

export type EditState = {
	timeline: TimelineFile
	outliner: OutlinerState
}

export type State = {
	updatedAt: number
	files: {
		hashes: string[]
	}
	metadata: Metadata
	edit: Chronicle<EditState>
	settings: Settings
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
	edit: chronicle({
		timeline: makeDefaultTimeline(withRoot),
		outliner: {
			tags: [],
			tagAssignments: [],
			rules: [],
			ruleAssignments: []
		},
	}),
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

