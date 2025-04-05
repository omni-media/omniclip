// function get_overlapping_effects(effect: Xeffect, effects: Xeffect[]): Overlapping[] {
// 	let overlapping: Overlapping[] = []
// 	const excluded = effects.filter(c => c.id !== effect.id)

// 	excluded.forEach((c) => {
// 		const from = Math.max(effect.start_at_position, c.start_at_position)
// 		const to = Math.min(effect.start_at_position + effect.duration, c.start_at_position + c.duration)
// 		if(from <= to)
// 			overlapping.push({effect, between: [from, to]})
// 	})

// 	return overlapping
// }
//
// interface Overlapping {
// 	effect: effectX
// 	between: V2
// }
