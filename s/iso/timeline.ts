import type {AudioSettings, Id, Item} from "@omnimedia/omnitool"

export type TimelineOperation =
	| {op: "add", item: Item.Any}
	| {op: "replace", itemId: Id, item: Item.Any}
	| {op: "remove", itemId: Id}
	| {op: "set_root", itemId: Id}
	| {op: "set_audio", audio: AudioSettings | null}

export type TimelinePatch = {
	baseRevision: number
	operations: TimelineOperation[]
}

export type TimelinePatchResult =
	| {success: true, revision: number, summary: string}
	| {success: false, error: string}
