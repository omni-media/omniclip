import type {Id} from "@omnimedia/omnitool"

export type TagId = string

export type Tag = {
	id: TagId
	label: string
	color?: string
}

export type TagAssignment = {
	itemId: Id
	tagIds: TagId[]
}

