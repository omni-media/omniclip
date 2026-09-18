import {Id, Item, Kind, TimelineFile} from "@omnimedia/omnitool"

export function crawl(file: TimelineFile, select: {
	video: (item: Item.Video) => void
	stack: (item: Item.Stack) => void
}) {
	const itemsMap = new Map(file.items.map(item => [item.id, item]))

	const walk = (id: Id) => {
		const item = itemsMap.get(id)!
		switch(item.kind) {
			case Kind.Video: {
				select.video(item as Item.Video)
			}
			case Kind.Stack: {
				select.stack(item as Item.Stack)
				walk(item.id)
			}

		}
	}

	walk(file.rootId)
}
