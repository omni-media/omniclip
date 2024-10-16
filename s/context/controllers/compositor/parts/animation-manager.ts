import gsap from "gsap"
import {pub} from "@benev/slate"
import {FabricObject} from "fabric"

import {Compositor} from "../controller.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"
import {calculateProjectDuration} from "../../../../utils/calculate-project-duration.js"

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
	timeline = gsap.timeline({
		duration: 10, // GSAP uses seconds instead of milliseconds
		paused: true,
	})

	#animations: Animation[] = []
	onChange = pub()

	constructor(private compositor: Compositor) {}

	selectedAnimationForEffect(effect: AnyEffect | null, animation: Animation) {
		if (!effect) return
		const haveAnimation = this.#animations.find(
			(anim) => anim.targetEffect.id === effect.id && animation.type === anim.type
		)
		return !!haveAnimation
	}

	isAnyAnimationInSelected(effect: AnyEffect | null) {
		if (!effect) return false
		const haveAnimation = this.#animations.find(
			(animation) => animation.targetEffect.id === effect.id && animation.type.includes("In")
		)
		return !!haveAnimation
	}

	isAnyAnimationOutSelected(effect: AnyEffect | null) {
		if (!effect) return false
		const haveAnimation = this.#animations.find(
			(animation) => animation.targetEffect.id === effect.id && animation.type.includes("Out")
		)
		return !!haveAnimation
	}

	updateTimelineDuration(duration: number) {
		this.timeline.duration(duration / 1000) // GSAP duration in seconds
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

	addAnimationToEffect(
		effect: ImageEffect | VideoEffect,
		animation: AnimationIn | AnimationOut,
		state?: State
	) {
		if (state) {
			this.timeline.duration(calculateProjectDuration(state.effects) / 1000)
		}

		const object = this.#getObject(effect)!
		this.#animations.push(animation)

		switch (animation.type) {
			case "slideIn": {
				const targetPosition = { left: effect.rect.position_on_canvas.x }
				const startPosition = { left: -effect.rect.width }

				// Set the start position before animation begins
				gsap.set(object, { left: startPosition.left })

				// Animate the object to the target position
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						left: targetPosition.left,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "slideOut": {
				const targetPosition = { left: effect.rect.width }
				const startPosition = { left: effect.rect.position_on_canvas.x }

				// Set the start position before animation begins
				gsap.set(object, { left: startPosition.left })

				// Animate the object to the target position
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						left: targetPosition.left,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}
		}

		this.onChange.publish(true)
	}

	play(time: number) {
		this.timeline.play(time / 1000)
	}

	pause() {
		this.timeline.pause()
	}

	seek(time: number) {
		this.timeline.seek(time / 1000)
	}

	updateAnimationTimelineDuration(duration: number) {
		this.timeline.duration(duration / 1000)
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
		gsap.killTweensOf(object!)
		this.#animations = this.#animations.filter(
			(animation) => !(animation.targetEffect.id === effect.id && animation.type.includes(type))
		)
		this.onChange.publish(true)
	}

	removeAllAnimationsFromEffect(effect: ImageEffect | VideoEffect, state: State) {
		const object = this.#getObject(effect)
		this.#resetObjectProperties(object!, effect)
		gsap.killTweensOf(object!)
		this.#animations = this.#animations.filter((animation) => animation.targetEffect.id !== effect.id)
		this.onChange.publish(true)
	}
}
