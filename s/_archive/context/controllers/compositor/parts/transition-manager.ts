import gsap from "gsap"
import {pub} from '@benev/slate'
import "gl-transitions/gl-transitions.js"

import {Actions} from '../../../actions.js'
import {Compositor} from '../controller.js'
import {omnislate} from '../../../context.js'
import {GLTransition} from "../../../global.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from '../../../types.js'
import {get_effect_at_timestamp} from "../../video-export/utils/get_effect_at_timestamp.js"
import {normalizeTransitionDuration} from '../../../../components/omni-transitions/utils/normalize-transition-duration.js'

export type TransitionAbleEffect = ImageEffect | VideoEffect

export interface Transition {
	id: string
	duration: number
	incoming: TransitionAbleEffect
	outgoing: TransitionAbleEffect
	transition: GLTransition
}

interface PropsToUpdate {
	duration: number
}

export const transitions = window.GLTransitions

export class TransitionManager {
	timeline = gsap.timeline({
		duration: 10, // GSAP uses seconds instead of milliseconds
		paused: true,
	})
	selected: null | string = null
	onChange = pub()
	#transitions = new Map<string, {
		destroy: () => void
		update: () => void
	}>()

	constructor (private compositor: Compositor, private actions: Actions) {}

	updateTimelineDuration(duration: number) {
		this.timeline.duration(duration / 1000)
	}

	clearTransitions (omit?: boolean) {
		this.actions.clear_animations({omit})
		this.actions.clear_transitions({omit})
		this.timeline.clear()
		this.selected = null
	}

	#getObject(effect: VideoEffect | ImageEffect) {
		const videoObject = this.compositor.managers.videoManager.get(effect.id)?.sprite
		const imageObject = this.compositor.managers.imageManager.get(effect.id)?.sprite
		if (videoObject) {
			return videoObject
		} else if (imageObject) {
			return imageObject
		}
	}

	isSelected(name: string) {
		if(!this.selected) {return false}
		return this.getTransition(this.selected)?.transition.name === name
	}

	selectTransition(transition: Transition, recreate?: boolean) {
		const halfDuration = transition.duration / 2
		this.selected = transition.id
		const alreadyAdded = this.getTransition(transition.id)
		const sameSelected = alreadyAdded?.transition.name === transition.transition.name

		if(alreadyAdded && !sameSelected) {
			this.removeTransition(transition.id)
			this.selected = transition.id
		}

		if(!alreadyAdded && !recreate) {
			this.actions.set_effect_start_position(
				transition.incoming,
				transition.incoming.start_at_position - halfDuration
			)
			this.actions.set_effect_start(
				transition.incoming,
				transition.incoming.start + halfDuration
			)
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
				const incoming = state.effects.find(e => e.id === transition.incoming.id) as VideoEffect | ImageEffect | undefined
				const outgoing = state.effects.find(e => e.id === transition.outgoing.id) as VideoEffect | ImageEffect | undefined
				if(!incoming || !outgoing) {return}
				const alreadyAdded = this.getTransition(transition.id)
				if(!alreadyAdded || recreate) {
					this.#selectTransition(
						{...transition, incoming, outgoing},
						state,
						recreate
					)
					this.updateTransition(state)
				}
			}
		}
	}

	refreshTransitions() {
		this.#transitions.forEach(transition => transition.update())
	}

	async updateTransition(state: State, propsToUpdate?: PropsToUpdate) {
		if (this.selected && propsToUpdate) {
			const newFullDuration = normalizeTransitionDuration(
				propsToUpdate.duration,
				1000 / state.timebase
			)

			const transition = this.getTransition(this.selected)
			if (transition) {
				const incoming = state.effects.find(e => e.id === transition.incoming.id)!
				const outgoing = state.effects.find(e => e.id === transition.outgoing.id)!
				const delta = (transition.duration - newFullDuration) / 2

				this.actions.set_transition_duration(newFullDuration, this.selected)

				this.actions.set_effect_start_position(
					incoming,
					incoming.start_at_position + delta
				)
				this.actions.set_effect_start(
					incoming,
					incoming.start - delta
				)
				this.actions.set_effect_end(
					outgoing,
					outgoing.end + delta
				)
			}
		}
		if (this.selected) {
			this.#transitions.get(this.selected)?.update()
			this.actions.update_transition(this.selected)
		}
	}

	update(transitionId: string) {
		this.#transitions.get(transitionId)?.update()
	}

	removeSelectedTransition() {
		if (this.selected) {
			this.removeTransition(this.selected)
			this.selected = null
		}
	}

	removeTransition(id: string, recreate?: boolean) {
		const transition = this.getTransition(id)
		if(!recreate) {this.actions.remove_transition(id)}
		this.#transitions.get(id)?.destroy()
		this.#transitions.delete(id)
		if (transition) {
			if (transition.id === this.selected) {
				this.selected = null
			}
		}
	}

	#fragmentShader(fragment: string) {
		const fragmentShader = `
			precision highp float;
			varying vec2 vTextureCoord;
			varying vec2 _uv;
			uniform sampler2D from, to;
			uniform float progress, ratio, _fromR, _toR;


			uniform float customUniform;

			vec4 getFromColor(vec2 uv){
				return texture2D(from, .5+(uv-.5)*vec2(max(ratio/_fromR,1.), max(_fromR/ratio,1.)));
			}
			vec4 getToColor(vec2 uv){
				return texture2D(to, .5+(uv-.5)*vec2(max(ratio/_toR,1.), max(_toR/ratio,1.)));
			}

			// gl-transition code here
			${fragment}
			// gl-transition code end

			void main(){
				vec2 uv = vTextureCoord.xy;
				gl_FragColor = transition(vTextureCoord);
			}
		`
		return fragmentShader
	}

	async #selectTransition(transition: Transition, state: State, recreate?: boolean) {
		if(recreate) {this.removeTransition(transition.id, recreate)}
		const incoming = this.#getObject(transition.incoming)
		const outgoing = this.#getObject(transition.outgoing)

		if (incoming && outgoing) {
			let rtFrom = PIXI.RenderTexture.create({ width: 1920, height: 1080 })
			let rtTo   = PIXI.RenderTexture.create({ width: 1920, height: 1080 })

			this.compositor.app.renderer.render(outgoing, { renderTexture: rtFrom })
			this.compositor.app.renderer.render(incoming, { renderTexture: rtTo })

			const transitionSprite = new PIXI.Sprite()
			transitionSprite.width = this.compositor.app.stage.width
			transitionSprite.height = this.compositor.app.stage.height
			transitionSprite.zIndex = omnislate.context.state.tracks.length - transition.incoming.track

			const updateRT = () => {
				this.compositor.app.renderer.render(outgoing, { renderTexture: rtFrom })
				this.compositor.app.renderer.render(incoming, { renderTexture: rtTo })
			}

			let incomingTween: GSAPTween

			const updateTransitionTexture = () => {
				if(incomingTween !== undefined) {
					if(incomingTween.progress() > 0 && incomingTween.progress() < 1) {
						incoming.alpha = 1
						outgoing.alpha = 1
						updateRT()
						outgoing.alpha = 0
						incoming.alpha = 0
					}
				}
			}

			const showTransition = () => {
				incoming.alpha = 0
				outgoing.alpha = 0
				this.compositor.app.stage.addChild(transitionSprite)
			}

			const hideTransition = () => {
				incoming.alpha = 1
				outgoing.alpha = 1
				this.compositor.app.stage.removeChild(transitionSprite)
			}

			const filter = new PIXI.Filter(
				vertexShader,
				//@ts-ignore
				this.#fragmentShader(transition.transition.glsl),
				{
					_fromR: 1,
					_toR: 1,
					ratio: 1,
					progress: 0,
					customUniform: 0,
					from: rtFrom,
					to: rtTo,
				}
			)

			for(const uniform in transition.transition.defaultParams) {
				//@ts-ignore
				filter.uniforms[uniform] = transition.transition.defaultParams[uniform]
			}

			transitionSprite.filters = [filter]
			const isTransitionActive = get_effect_at_timestamp(transition.incoming, state.timecode) || get_effect_at_timestamp(transition.outgoing, state.timecode)
			if(isTransitionActive) {
				this.compositor.app.stage.addChild(transitionSprite)
			}
			const startMargin = 10
			const endMargin = 20

			incomingTween = gsap.fromTo(
				//@ts-ignore
				filter.uniforms,
				{
					progress: 0,
					customUniform: 0,
					ease: "linear",
				},
				{
					progress: 1,
					customUniform: 1,
					duration: (transition.duration + endMargin) / 1000,
					onUpdate: this.#onReverse(showTransition, true, () => updateTransitionTexture()),
					onComplete: hideTransition,
					onStart: showTransition,
					onReverseComplete: hideTransition
				}
			)

			const startTime = (transition.incoming.start_at_position - (transition.duration / 2) - startMargin) / 1000
			this.timeline.add(incomingTween, startTime)
			if(!recreate) {this.actions.add_transition(transition)}
			this.compositor.app.stage.sortChildren()

			const update = () => {
				const t = this.getTransition(transition.id)
				if(t) {
					const incoming = omnislate.context.state.effects.find(e => e.id === t.incoming.id)!
					const startTime = (incoming.start_at_position - (t.duration / 2) - startMargin) / 1000
					incomingTween.startTime(startTime)
					incomingTween.duration((t.duration + endMargin) / 1000)
					updateTransitionTexture()
				}
			}
			
			const destroy = () => {
				transitionSprite.destroy()
				rtFrom.destroy()
				rtTo.destroy()
				filter.destroy()
				incomingTween.kill()
				this.timeline.remove(incomingTween)
				incoming.alpha = 1
				outgoing.alpha = 1
			}

			this.#transitions.set(transition.id, {
				destroy,
				update
			})
		}
	}

	#onReverse(func: () => void, onlyAfterComplete: boolean, tick: () => void) {
		let previousTime = 0
		let reverseTriggered = false

		return function(this: GSAPTweenVars) {
			const currentTime = this.time()
			const isReversing = currentTime < previousTime
			tick()

			if (
				isReversing &&
				!reverseTriggered &&
				//@ts-ignore
				(!onlyAfterComplete || previousTime === this.duration())
			) {
				func.call(this)
			}

			previousTime = currentTime
			reverseTriggered = isReversing
		}
	}

	play(time: number) {
		this.timeline.play(time / 1000)
	}

	pause() {
		this.timeline.pause()
	}

	seek(time: number) {
		this.timeline.seek(time / 1000, false)
	}

	getTransition(id: string | null) {
		return omnislate.context.state.transitions.find(t => t.id === id)
	}

	getTransitionByEffect(effect: AnyEffect) {
		return omnislate.context.state.transitions.find(t => t.incoming.id === effect.id || t.outgoing.id === effect.id)
	}

	protected getAnimations(effect: AnyEffect) {
		return omnislate.context.state.transitions.filter(a => a.incoming.id === effect.id)
	}

	getTransitionDuration(id: string | null) {
		let duration = this.getTransition(id)?.duration
		return duration
	}

	getTransitionDurationPerEffect(transition: Transition | undefined, effect: AnyEffect) {
		let incoming = 0
		let outgoing = 0
		if(transition) {
			if(effect.id === transition.incoming.id) {
				incoming = transition.duration / 2
			} else if(effect.id === transition.outgoing.id) {
				outgoing = transition.duration / 2
			}
		}
		return {incoming, outgoing}
	}

	getTransitions () {
		return omnislate.context.state.transitions.map(a => ({
			...a,
			duration: a.duration / 2
		}))
	}

	getTransitionByPair(outgoing: TransitionAbleEffect, incoming: TransitionAbleEffect) {
		return omnislate.context.state.transitions.find(t => t.incoming.id === incoming.id && t.outgoing.id === outgoing.id)
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

		omnislate.context.state.transitions.map(transition => {
			if (!stillTouchingIds.has(transition.incoming.id) || !stillTouchingIds.has(transition.outgoing.id)) {
				this.removeTransition(transition.id)
			}
		})
	}
}

const vertexShader = `
	attribute vec2 aVertexPosition;
	varying vec2 _uv;                          // gl-transition
	uniform mat3 projectionMatrix;
	uniform vec4 inputSize;
	uniform vec4 outputFrame;
	varying vec2 vTextureCoord;
	uniform float uTextureWidth;
	uniform float uTextureHeight;

	vec4 filterVertexPosition( void )
	{
	vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
	return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
	}

	vec2 filterTextureCoord( void )
	{
	return aVertexPosition * (outputFrame.zw * inputSize.zw);
	}

	void main(void)
	{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	_uv = vec2(0.5, 0.5) * (aVertexPosition +vec2(1.0, 1.0));    // gl-transition
	}
`

// type Options = {
//   resizeMode?: "cover" | "contain" | "stretch",
// };

// const resizeModes: { [_: string]: any } = {
//   cover: (r: string) =>
//     `.5+(uv-.5)*vec2(min(ratio/${r},1.),min(${r}/ratio,1.))`,
//   contain: (r: string) =>
//     `.5+(uv-.5)*vec2(max(ratio/${r},1.),max(${r}/ratio,1.))`,
//   stretch: () => "uv",
// };
