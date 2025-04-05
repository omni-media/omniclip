import {AnyEffect} from "../../../context/types.js"

export function calculate_effect_track_index(y: number, number_of_tracks: number, effects: AnyEffect[]) {
	let acc = 0
	let index = 0

	for (let i = 0; i < number_of_tracks; i++) {
		const video_effect = effects.find(effect => effect.track === i && effect.kind === "video")
		const text_effect = effects.find(effect => effect.track === i && effect.kind === "text")
		let trackHeight = 50

		if (!video_effect && text_effect) {
			trackHeight = 30
		}

		if (acc + trackHeight >= y) {
			return index
		}

		acc += trackHeight
		index += 1
	}

	return index
}
