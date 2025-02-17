import {Actions} from '../../../actions.js'
import {Compositor} from '../controller.js'
import {omnislate} from '../../../context.js'
import {AnimationManager} from './animation-manager.js'
import {AnyEffect, ImageEffect, State, VideoEffect} from '../../../types.js'
import {normalizeTransitionDuration} from '../../../../components/omni-transitions/utils/normalize-transition-duration.js'

export const transition = ['fade'] as const
export type TransitionAbleEffect = ImageEffect | VideoEffect
type TransitionAnimation = 'fade'

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
	effect: ImageEffect | VideoEffect
	duration: number
}

export class TransitionManager extends AnimationManager {
	selected: null | SelectedPair = null

	constructor (compositor: Compositor, actions: Actions) {
		super(compositor, actions, 'Transition')
	}

	clearTransitions (omit?: boolean) {
		this.clearAnimations(omit)
		this.selected = null
	}

	isSelected (kind: TransitionAnimation) {
		if (this.selected) {
			return !!this.getAnyAnimation(this.selected.incoming)?.name.includes(kind)
		}
		return false
	}

	selectTransition (transition: Transition) {
		const halfDuration = transition.duration / 2
		this.selected = {
			incoming: transition.incoming,
			outgoing: transition.outgoing
		}
		if (!this.isAnyAnimationInSelected(transition.incoming)) {
			this.actions.set_effect_start_position(
				transition.incoming,
				transition.incoming.start_at_position - halfDuration
			)
			this.actions.set_effect_start(
				transition.incoming,
				transition.incoming.start + halfDuration
			)
		}
		if (!this.isAnyAnimationOutSelected(transition.outgoing)) {
			this.actions.set_effect_end(
				transition.outgoing,
				transition.outgoing.end - halfDuration
			)
		}

		this.onChange.publish(0)

		// Return an object with an apply method that re-reads state and schedules the tweens.
		// This ensures that on the receiving side the latest effect properties are used.
		return {
			apply: async (state: State) => {
				const incomingEffect = state.effects.find(e => e.id === transition.incoming.id) as VideoEffect | ImageEffect
				const outgoingEffect = state.effects.find(e => e.id === transition.outgoing.id) as VideoEffect | ImageEffect

				if (!this.isAnyAnimationInSelected(incomingEffect)) {
					await this.selectAnimation(
						incomingEffect,
						{
							targetEffect: incomingEffect,
							type: 'in',
							duration: transition.duration,
							name: 'fade-in',
							for: 'Transition'
						},
						state
					)
				}
				if (!this.isAnyAnimationOutSelected(outgoingEffect)) {
					await this.selectAnimation(
						outgoingEffect,
						{
							targetEffect: outgoingEffect,
							type: 'out',
							duration: transition.duration,
							name: 'fade-out',
							for: 'Transition'
						},
						state
					)
				}
			}
		}
	}

	async updateTransition (state: State, propsToUpdate?: PropsToUpdate) {
		if (this.selected && propsToUpdate) {
			const fullDuration = normalizeTransitionDuration(propsToUpdate.duration, 1000 / state.timebase)
			const halfDuration = fullDuration / 2

			const {incoming, outgoing} = this.selected
			this.actions.set_animation_duration(fullDuration, outgoing, "Transition")
			this.actions.set_animation_duration(fullDuration, incoming, "Transition")
			this.actions.set_effect_start_position(
				incoming,
				incoming.start_at_position - halfDuration
			)
			this.actions.set_effect_start(
				incoming,
				incoming.start + halfDuration
			)
			this.actions.set_effect_end(
				outgoing,
				outgoing.end - halfDuration
			)
		}
	}

	removeSelectedTransition () {
		if (this.selected) {
			const {incoming, outgoing} = this.selected
			this.deselectAnimation(incoming, 'in')
			this.deselectAnimation(outgoing, 'out')
			this.selected = null
		}
	}

	removeAllTransitions (effect: AnyEffect) {
		const animations = this.getAnimations(effect)
		animations.forEach(a => this.deselectAnimation(a.targetEffect, a.type))
	}

	async removeTransition (effect: AnyEffect, kind: 'incoming' | 'outgoing') {
		const animation = this.getAnimation(effect, kind === 'incoming' ? 'in' : 'out')
		if (animation) {
			if (
				animation.targetEffect.id === this.selected?.incoming.id ||
				animation.targetEffect.id === this.selected?.outgoing.id
			) {
				this.selected = null
			}
			await this.deselectAnimation(animation.targetEffect, kind === 'incoming' ? 'in' : 'out')
		}
	}

	getTransition (effect: AnyEffect) {
		return this.getAnyAnimation(effect)
	}

	getTransitionByKind(effect: AnyEffect, kind: "in" | "out") {
		return this.getAnimation(effect, kind)
	}

	getTransitionDuration(effect: AnyEffect) {
		let incoming = this.getTransitionByKind(effect, "in")?.duration
		let outgoing = this.getTransitionByKind(effect, "out")?.duration
		return {incoming: incoming ? incoming / 2 : 0, outgoing: outgoing ? outgoing / 2 : 0}
	}

	getTransitions () {
		return omnislate.context.state.animations.map(a => ({
			...a,
			duration: a.duration / 2
		}))
	}

	findTouchingClips (clips: AnyEffect[]) {
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
				const currentClipEnd = currentClip.start_at_position + (currentClip.end - currentClip.start)
				if (
					currentClipEnd === nextClip.start_at_position &&
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
}
