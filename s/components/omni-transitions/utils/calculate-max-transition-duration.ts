import {State} from "../../../context/types.js"
import {Transition} from "../../../context/controllers/compositor/parts/transition-manager.js"

export function calculateMaxTransitionDuration(transition: Transition | undefined, state: State) {
	const incoming = state.effects.find(e => e.id === transition?.incoming.id)
	const outgoing = state.effects.find(e => e.id === transition?.outgoing.id)
	if(!incoming || !outgoing) {return 0}
	const incomingEffectDuration = incoming.end - incoming.start
	const outgoingEffectDuration = outgoing.end - outgoing.start

	if(incomingEffectDuration < outgoingEffectDuration) {
		return incomingEffectDuration / 1.2
	} else {
		return outgoingEffectDuration / 1.2
	}
}
