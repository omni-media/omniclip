import {pub} from "@benev/slate"
import {FabricObject} from "fabric"
import anime from "animejs/lib/anime.es.js"

import {Compositor} from "../controller.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"
import { calculateProjectDuration } from "../../../../utils/calculate-project-duration.js"

interface AnimationBase<T = AnimationIn | AnimationOut> {
	targetEffect: VideoEffect | ImageEffect
	type: T
}
export const animationNone = "none" as const
export const animationIn = ["slideIn"] as const
export const animationOut = ["slideOut"] as const
export type AnimationIn = AnimationBase<(typeof animationIn)[number]>
export type AnimationOut = AnimationBase<(typeof animationOut)[number]>
export type AnimationNone = AnimationBase<(typeof animationNone)[number]>
export type Animation = AnimationIn | AnimationOut

export class AnimationManager {
	timeline = anime.timeline({
		duration: 10000,
		autoplay: false,
	})

	#animations: Animation[] = []
	onChange = pub()

	constructor(private compositor: Compositor) {}

	selectedAnimationForEffect(effect: AnyEffect | null, animation: Animation) {
		if(!effect) return
		const haveAnimation = this.#animations.find(anim => anim.targetEffect.id === effect.id && animation.type === anim.type)
		if(haveAnimation) {
			return true
		} else return false
	}

	isAnyAnimationInSelected(effect: AnyEffect | null) {
		if(!effect) return
		const haveAnimation = this.#animations.find(animation => animation.targetEffect.id === effect.id && animation.type.includes("In"))
		if(haveAnimation) {
			return true
		} else false
	}

	isAnyAnimationOutSelected(effect: AnyEffect | null) {
		if(!effect) return
		const haveAnimation = this.#animations.find(animation => animation.targetEffect.id === effect.id && animation.type.includes("Out"))
		if(haveAnimation) {
			return true
		} else false
	}

	updateTimelineDuration(duration: number) {
		this.timeline.duration = duration
	}

	#getObject(effect: VideoEffect | ImageEffect) {
		const videoObject = this.compositor.managers.videoManager.get(effect.id)
		const imageObject = this.compositor.managers.imageManager.get(effect.id)
		if(videoObject) {
			return videoObject
		} else if(imageObject) {
			return imageObject
		}
	}

	refreshAnimations(
		effects: AnyEffect[]
	) {
		anime.remove(this.timeline)
		this.timeline = anime.timeline({
			duration: this.timeline.duration,
			autoplay: false,
		})
		const updated = this.#animations.map(animation => {
			const effect = effects.find(effect => effect.id === animation.targetEffect.id) as ImageEffect | VideoEffect | undefined
			return {
			...animation,
			targetEffect: effect ?? animation.targetEffect
		}})
		this.#animations = updated
		this.#animations.forEach(animation => this.addAnimationToEffect(animation.targetEffect, animation))
	}

	addAnimationToEffect(
		effect: ImageEffect | VideoEffect,
		animation: AnimationIn | AnimationOut,
		state?: State
	) {
		if(state) {this.timeline.duration = calculateProjectDuration(state.effects)}
		const object = this.#getObject(effect)
		this.#animations.push(animation)
		switch (animation.type) {
			case "slideIn": {
				const targetPosition = {left: effect.rect.position_on_canvas.x}
				const startPosition = {left: -effect.rect.width}
				this.timeline.add({
					targets: object,
					duration: 1000,
					left: [startPosition.left, targetPosition.left],
					easing: "linear",
					update: () => this.compositor.canvas.renderAll()
				},
					effect.start_at_position,
				)
				break
			}
			case "slideOut": {
				const targetPosition = {left: effect.rect.width}
				const startPosition = {left: effect.rect.position_on_canvas.x}
				this.timeline.add({
					targets: object,
					duration: 1000,
					left: [startPosition.left, targetPosition.left],
					easing: "linear",
					update: () => this.compositor.canvas.renderAll(),
				},
					effect.start_at_position + (effect.end - effect.start) - 1000,
				)
				break
			}
		}
		this.onChange.publish(true)
	}

	play(time: number) {
		// console.log(this.timeline.currentTime, this.timeline.progress, "PLAYI", time)
		// this.timeline.seek(time)
		// this.timeline.play()
		// console.log("anim plays", this.timeline)
	}

	pause() {
		this.timeline.pause()
	}

	seek(time: number) {
		this.timeline.seek(time)
	}

	updateAnimationTimelineDuration(duration: number) {
		this.timeline.duration = duration
	}

	#resetObjectProperties(fabric: FabricObject, effect: ImageEffect | VideoEffect) {
		fabric.left = effect.rect.position_on_canvas.x
		fabric.top = effect.rect.position_on_canvas.y
		fabric.scaleX = effect.rect.scaleX
		fabric.scaleY = effect.rect.scaleY
		fabric.angle = effect.rect.rotation
		fabric.width = effect.rect.width
		fabric.height = effect.rect.height
	}

	removeAnimationFromEffect(effect: ImageEffect | VideoEffect, type: "In" | "Out", state: State) {
		const object = this.#getObject(effect)
		this.#resetObjectProperties(object!, effect)
		anime.remove(object!)
		const filtered = this.#animations.filter(animation => !(animation.targetEffect.id === effect.id && animation.type.includes(type)))
		this.#animations = filtered
		this.refreshAnimations(state.effects)
		this.onChange.publish(true)
	}

	removeAllAnimationsFromEffect(effect: ImageEffect | VideoEffect, state: State) {
		const object = this.#getObject(effect)
		this.#resetObjectProperties(object!, effect)
		anime.remove(object!)
		const filtered = this.#animations.filter(animation => !(animation.targetEffect.id === effect.id))
		this.#animations = filtered
		this.refreshAnimations(state.effects)
		this.onChange.publish(true)
	}
}
