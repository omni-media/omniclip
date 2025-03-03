import gsap from "gsap"
import {pub} from '@benev/slate'
import "gl-transitions/gl-transitions.js"

import {Actions} from '../../../actions.js'
import {Compositor} from '../controller.js'
import {omnislate} from '../../../context.js'
import {GLTransition} from "../../../global.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from '../../../types.js'
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
	effect: ImageEffect | VideoEffect
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
	#transitions: Transition[] = []
	#destroyTransitions = new Map<string, () => void>()

	constructor (private compositor: Compositor, private actions: Actions) {}

	clearTransitions (omit?: boolean) {
		this.#transitions.forEach(a => this.removeTransition(a.id))
		this.#transitions = []
		this.actions.clear_animations({omit})
		this.timeline.clear()
		this.selected = null
	}

	#getObject(effect: VideoEffect | ImageEffect) {
		const videoObject = this.compositor.managers.videoManager.get(effect.id)
		const imageObject = this.compositor.managers.imageManager.get(effect.id)
		if (videoObject) {
			return videoObject
		} else if (imageObject) {
			return imageObject
		}
	}

	isSelected(effect: AnyEffect | null, name: string) {
		if(!effect) {return false}
		return this.getTransitionByEffect(effect)?.transition.name === name
	}

	selectTransition(transition: Transition) {
		const halfDuration = transition.duration / 2
		this.selected = transition.id
		const alreadyAdded = this.getTransitionByEffect(transition.outgoing) || this.getTransitionByEffect(transition.incoming)
		if(!alreadyAdded) {
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
				const incoming = state.effects.find(e => e.id === transition.incoming.id) as VideoEffect | ImageEffect
				const outgoing = state.effects.find(e => e.id === transition.outgoing.id) as VideoEffect | ImageEffect
				const alreadyAdded = this.getTransitionByEffect(outgoing) || this.getTransitionByEffect(incoming)
				if(!alreadyAdded) {
					this.#selectTransition(
						{
							incoming,
							outgoing,
							transition: transition.transition,
							duration: transition.duration,
							id: transition.id
						},
					state
					)
				}
			}
		}
	}

	refreshTransitions() {
		this.timeline.getChildren().forEach(children => children.kill())
		omnislate.context.state.transitions.forEach(transition => {
			this.removeTransition(transition.id)
			this.selectTransition(transition).apply(omnislate.context.state)
		})
	}

	async updateTransition (state: State, propsToUpdate?: PropsToUpdate) {
		if (this.selected && propsToUpdate) {
			const fullDuration = normalizeTransitionDuration(propsToUpdate.duration, 1000 / state.timebase)
			const halfDuration = fullDuration / 2

			const transition = this.getTransition(this.selected)
			if(transition) {
				const {outgoing, incoming} = transition
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
	}

	removeSelectedTransition() {
		if (this.selected) {
			this.removeTransition(this.selected)
			this.selected = null
		}
	}

	async removeTransition (id: string) {
		const transition = this.getTransition(id)
		this.actions.remove_transition(id)
		this.#destroyTransitions.get(id)?.()
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

	async #selectTransition(transition: Transition, state: State) {
		const incoming = this.#getObject(transition.incoming)
		const outgoing = this.#getObject(transition.outgoing)

		if (incoming && outgoing) {
			let rtFrom = PIXI.RenderTexture.create({ width: 1920, height: 1080 })
			let rtTo   = PIXI.RenderTexture.create({ width: 1920, height: 1080 })

			this.compositor.app.renderer.render(outgoing, { renderTexture: rtFrom })
			this.compositor.app.renderer.render(incoming, { renderTexture: rtTo })

			const transitionSprite = new PIXI.Sprite()
			transitionSprite.width = 1920
			transitionSprite.height = 1080
			transitionSprite.zIndex = omnislate.context.state.tracks.length - transition.incoming.track

			const updateRT = () => {
				this.compositor.app.renderer.render(outgoing, { renderTexture: rtFrom })
				this.compositor.app.renderer.render(incoming, { renderTexture: rtTo })
			}

			const filter = new PIXI.Filter(
				vertexShader,
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
				filter.uniforms[uniform] = transition.transition.defaultParams[uniform]
			}

			transitionSprite.filters = [filter]
			this.compositor.app.stage.addChild(transitionSprite)
			const margin = 10 // 10 ms

			const incomingTween = gsap.fromTo(
				filter.uniforms,
				{
					progress: 0,
					customUniform: 0,
					ease: "linear",
				},
				{
					progress: 1,
					customUniform: 1,
					duration: (transition.duration * 2 + margin) / 1000,
					onUpdate: this.#onReverse(() => {
						updateRT()
						incoming.alpha = 0
						outgoing.alpha = 0
						this.compositor.app.stage.addChild(transitionSprite)
					}, true),
					onComplete: () => {
						incoming.alpha = 1
						outgoing.alpha = 1
						updateRT()
						this.compositor.app.stage.removeChild(transitionSprite)
					},
					onStart: () => {
						updateRT()
						incoming.alpha = 0
						outgoing.alpha = 0
						this.compositor.app.stage.addChild(transitionSprite)
					},
					onReverseComplete: () => {
						incoming.alpha = 1
						outgoing.alpha = 1
						updateRT()
						this.compositor.app.stage.removeChild(transitionSprite)
					}
				}
			)

			const startTime = (transition.incoming.start_at_position - transition.duration - margin) / 1000
			this.timeline.add(incomingTween, startTime)
			this.actions.add_transition(transition)
			this.compositor.app.stage.sortChildren()
			
			const destroyTransition = () => {
				transitionSprite.destroy()
				rtFrom.destroy()
				rtTo.destroy()
				filter.destroy()
				incomingTween.kill()
				this.timeline.remove(incomingTween)
			}
			this.#destroyTransitions.set(transition.id, destroyTransition)
		}
	}

	#onReverse(func: () => void, onlyAfterComplete: boolean) {
		let previousTime = 0
		let reverseTriggered = false

		return function(this: GSAPTweenVars) {
			const currentTime = this.time()
			const isReversing = currentTime < previousTime

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

	getTransition(id: string) {
		return omnislate.context.state.transitions.find(t => t.id === id)
	}

	getTransitionByEffect(effect: AnyEffect) {
		return omnislate.context.state.transitions.find(t => t.incoming.id === effect.id || t.outgoing.id === effect.id)
	}

	protected getAnimations(effect: AnyEffect) {
		return omnislate.context.state.transitions.filter(a => a.incoming.id === effect.id)
	}

	getTransitionDuration(id: string) {
		let duration = this.getTransition(id)
		return duration
	}

	getTransitions () {
		return omnislate.context.state.transitions.map(a => ({
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

		this.#transitions.map(async transition => {
			if (!stillTouchingIds.has(transition.incoming.id) || !stillTouchingIds.has(transition.outgoing.id)) {
				await this.removeTransition(transition.id)
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
