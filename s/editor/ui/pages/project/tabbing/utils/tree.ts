import {Id, Item, Kind, TimelineFile} from "@omnimedia/omnitool"

export function crawl(file: TimelineFile): Item.Any[][] {
	const itemsMap = new Map(file.items.map(item => [item.id, item]))
	const tracks: Item.Any[][] = []

	const walk = (id: Id, track: number) => {
		const item = itemsMap.get(id)!
		switch(item.kind) {
			case Kind.Video: {
				if(tracks.length <= track)
					tracks.push([])
				tracks[track].push(item)
				break
			}
			case Kind.Sequence: {
				item.childrenIds.forEach(i => walk(i, track))
				break
			}
			case Kind.Stack: {
				item.childrenIds.forEach(i => walk(i, track))
				break
			}

		}
	}

	walk(file.rootId, 0)
	return tracks
}
