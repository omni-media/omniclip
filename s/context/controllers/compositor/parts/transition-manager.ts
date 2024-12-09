import {Actions} from "../../../actions.js"
import {Compositor} from "../controller.js"
import {AnimationManager} from "./animation-manager.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"

export const transition = ["fade"] as const
export type TransitionAbleEffect = ImageEffect | VideoEffect
type TransitionAnimation = "fade"

export type SelectedPair = {
	incoming: TransitionAbleEffect
	outgoing: TransitionAbleEffect
}

interface Transition {
	animation: TransitionAnimation
	duration: number
	incoming: TransitionAbleEffect
	outgoing: TransitionAbleEffect
}

interface PropsToUpdate {
	duration: number
}

export class TransitionManager extends AnimationManager {
	selected: null | SelectedPair = null

	constructor(private actions: Actions, compositor: Compositor) {
		super(compositor)
	}

	clearTransitions() {
		this.clearAnimations()
		this.selected = null
	}

	isSelected(kind: TransitionAnimation) {
		if(this.selected) {
			return this.getAnyAnimation(this.selected.incoming)?.name.includes(kind)
		} else false
	}

	selectTransition(transition: Transition, kind?: TransitionAnimation) {
		this.onChange.publish(0)
		this.selected = {
			incoming: transition.incoming,
			outgoing: transition.outgoing
		}
		if(!this.isAnyAnimationInSelected(transition.incoming)) {
			this.actions.set_effect_start_position(transition.incoming, transition.incoming.start_at_position - transition.duration / 2)
			this.actions.set_effect_start(transition.incoming, transition.incoming.start + transition.duration / 2)
		}
		if(!this.isAnyAnimationOutSelected(transition.outgoing)) {
			this.actions.set_effect_end(transition.outgoing, transition.outgoing.end - transition.duration / 2)
		}

		return {
			apply: (state: State) => {
				if(!this.isAnyAnimationInSelected(transition.incoming)) {
					const effect = state.effects.find(e => e.id === transition.incoming.id) as VideoEffect | ImageEffect
					this.selectAnimation(
						effect,
						{targetEffect: transition.incoming,
						type: "in",
						duration: transition.duration / 1000,
						name: "fade-in"},
						state
					)
				}
				if(!this.isAnyAnimationOutSelected(transition.outgoing)) {
					const effect = state.effects.find(e => e.id === transition.outgoing.id) as VideoEffect | ImageEffect
					this.selectAnimation(
						effect,
						{targetEffect: transition.outgoing,
						type: "out",
						duration: transition.duration / 1000,
						name: "fade-out"
						},
						state
					)
				}
			}
		}
	}

	async updateTransition(state: State, propsToUpdate?: PropsToUpdate) {
		if(this.selected && propsToUpdate) {
			const {incoming, outgoing} = this.selected
			const newDuration = propsToUpdate.duration * 1000
			await this.refresh(state, propsToUpdate)
			this.actions.set_effect_start_position(incoming, incoming.start_at_position - newDuration / 2)
			this.actions.set_effect_start(incoming, incoming.start + newDuration / 2)
			this.actions.set_effect_end(outgoing, outgoing.end - newDuration / 2)
		}
	}

	removeSelectedTransition() {
		const {outgoing, incoming} = this.selected!
		this.deselectAnimation(incoming, "in")
		this.deselectAnimation(outgoing, "out")
		this.selected = null
	}

	removeAllTransitions(effect: AnyEffect) {
		const animations = this.getAnimations(effect)
		animations.forEach(a => this.deselectAnimation(a.targetEffect, a.type))
	}

	async removeTransition(effect: AnyEffect, kind: "incoming" | "outgoing") {
		const animation = this.getAnimation(effect, kind === "incoming" ? "in" : "out")
		if(animation) {
			if(animation.targetEffect.id === this.selected?.incoming.id ||
				animation.targetEffect.id === this.selected?.outgoing.id) {this.selected = null}
			await this.deselectAnimation(animation.targetEffect, kind === "incoming" ? "in" : "out")
		}
	}

	getTransition(effect: AnyEffect) {
		return this.getAnyAnimation(effect)
	}

	removeTransitionFromNoLongerTouchingEffects(state: State) {
		const touchingClips = this.findTouchingClips(state.effects)
		const stillTouchingIds = new Set<string>()

		touchingClips.forEach(({outgoing, incoming}) => {
			stillTouchingIds.add(outgoing.id)
			stillTouchingIds.add(incoming.id)
		})

		this.animations.map(async transition => {
			if (!stillTouchingIds.has(transition.targetEffect.id)) {
				await this.removeTransition(transition.targetEffect, transition.type === "in" ? "incoming" : "outgoing")
			}
		})
	}

	getTransitions() {
		return this.animations.map(a => ({
			...a,
			duration: a.duration / 2 * 1000
		}))
	}

	getTransitionDuration(effect: AnyEffect) {
		const transition = this.getTransition(effect)
		let incoming = 0
		let outgoing = 0
		if(transition) {
			if(transition.type === "in") {
				incoming = transition.duration / 2 * 1000
			} else {
				outgoing = transition.duration / 2 * 1000
			}
		}
		return {incoming, outgoing}
	}


	findTouchingClips(clips: AnyEffect[]) {
		const clipsByTrack: Record<number, AnyEffect[]> = clips.reduce((acc, clip) => {
			acc[clip.track] = acc[clip.track] || []
			acc[clip.track].push(clip)
			return acc
		}, {} as Record<number, AnyEffect[]>)

		const touchingClips: {outgoing: TransitionAbleEffect; incoming: TransitionAbleEffect; position: number}[] = []

		Object.values(clipsByTrack).forEach(trackClips => {
			const sortedClips = trackClips.sort((a, b) => a.start_at_position - b.start_at_position)

			for (let i = 0; i < sortedClips.length - 1; i++) {
				const currentClip = sortedClips[i]
				const nextClip = sortedClips[i + 1]
				const currentClipEndPosition = currentClip.start_at_position + (currentClip.end - currentClip.start)

				if (
					currentClipEndPosition === nextClip.start_at_position &&
					['image', 'video'].includes(currentClip.kind) &&
					['image', 'video'].includes(nextClip.kind)
				) {
					touchingClips.push({
						outgoing: currentClip as TransitionAbleEffect,
						incoming: nextClip as TransitionAbleEffect,
						position: nextClip.start_at_position
					})
				}
			}
		})

		return touchingClips
	}
}
