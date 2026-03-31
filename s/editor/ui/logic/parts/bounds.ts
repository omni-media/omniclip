import {Kind, Item} from "@omnimedia/omnitool"

export type TimelineClip = Item.Video | Item.Audio | Item.Text

export const getBounds = (
	item: TimelineClip,
	mediaDuration?: number
) => {
	const start = item.kind === Kind.Text ? 0 : (item.start ?? 0)
	return {
		start,
		end: start + item.duration,
		maxEnd: item.kind === Kind.Text ? Infinity : (mediaDuration ?? start + item.duration)
	}
}

export const applyBounds = (
	item: TimelineClip,
	start: number,
	duration: number
): TimelineClip => {
	if (item.kind === Kind.Text) return { ...item, duration }
	return { ...item, start, duration }
}
