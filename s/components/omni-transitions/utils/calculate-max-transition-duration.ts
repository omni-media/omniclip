import {State} from "../../../context/types.js"
import {SelectedPair} from "../../../context/controllers/compositor/parts/transition-manager.js"

export function calculateMaxTransitionDuration(transition: SelectedPair, state: State) {
	const incoming = state.effects.find(e => e.id === transition.incoming.id)!
	const outgoing = state.effects.find(e => e.id === transition.outgoing.id)!
	const incomingEffectDuration = incoming.end - incoming.start
	const outgoingEffectDuration = outgoing.end - outgoing.start

	if(incomingEffectDuration < outgoingEffectDuration) {
		return incomingEffectDuration / 1000 / 1.2
	} else {
		return outgoingEffectDuration / 1000 / 1.2
	}
}
