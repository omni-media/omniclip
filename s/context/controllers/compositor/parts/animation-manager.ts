import gsap from "gsap"
import {pub} from "@benev/slate"
import {FabricObject, Rect, filters} from "fabric"

import {Compositor} from "../controller.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"
import {calculateProjectDuration} from "../../../../utils/calculate-project-duration.js"

interface AnimationBase<T = AnimationIn | AnimationOut> {
	targetEffect: VideoEffect | ImageEffect
	type: T
}
export const animationNone = "none" as const
export const animationIn = ["slideIn", "fadeIn", "spinIn", "bounceIn", "wipeIn", "blurIn"] as const
export const animationOut = ["slideOut", "fadeOut", "spinOut", "bounceOut", "wipeOut", "blurOut"] as const
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

	refreshAnimations(effects: AnyEffect[], state: State) {
		this.timeline.clear()
		const updated = this.#animations.map((animation) => {
			const effect = effects.find((effect) => effect.id === animation.targetEffect.id) as ImageEffect | VideoEffect | undefined
			return {
				...animation,
				targetEffect: effect ?? animation.targetEffect,
			}
		})
		this.#animations = updated
		this.#animations.forEach((animation) => {
			this.deselectAnimation(
				animation.targetEffect,
				state,
				animation.type.includes("In") ? "In" : "Out",
			)
			this.selectAnimation(animation.targetEffect, animation, state)
		})
	}

	async selectAnimation(
		effect: ImageEffect | VideoEffect,
		animation: AnimationIn | AnimationOut,
		state: State
	) {
		const type = animation.type.includes("In") ? "In" : "Out"
		const alreadySelected = this.#animations.find(a => a.targetEffect.id === effect.id && a.type === animation.type)
		if(alreadySelected) {
			return
		}

		const isDifferentAnimationSelected = this.#animations.find(a => a.targetEffect.id === effect.id && a.type.includes(type))
		if(isDifferentAnimationSelected) {
			// deselect current animation
			this.deselectAnimation(effect, state, type)
			// continue with selecting different animation
		}

		if (state) {
			this.timeline.duration(calculateProjectDuration(state.effects) / 1000)
		}

		const object = this.#getObject(effect)!
		this.#animations.push(animation)

		await this.compositor.seek(state.timecode, true)

		const currentTime = this.compositor.get_effect_current_time_relative_to_timecode(effect, state.timecode)
		const duration = 1
		let animationInProgress = currentTime / duration >= duration ? 1 : currentTime / duration
		const animationInProgressInWidth = effect.rect.width * animationInProgress

		const animationOutStartTime = effect.end / 1000 - duration
		let animationOutProgress = 0

		if (currentTime >= animationOutStartTime) {
			const elapsedTime = currentTime - animationOutStartTime
			animationOutProgress = elapsedTime / duration >= 1 ? 1 : elapsedTime / duration
		}

		const animationOutProgressInWidth = effect.rect.width * animationOutProgress

		switch (animation.type) {
			case "slideIn": {
				const targetPosition = {left: effect.rect.position_on_canvas.x + (effect.rect.width - animationInProgressInWidth)}
				const startPosition = {left: effect.rect.position_on_canvas.x - animationInProgressInWidth}

				gsap.set(object, { left: startPosition.left })
				this.timeline.add(
					gsap.to(object, {
						duration,
						left: targetPosition.left,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "slideOut": {
				const targetPosition = {left: effect.rect.position_on_canvas.x + (effect.rect.width - animationOutProgressInWidth)}
				const startPosition = {left: effect.rect.position_on_canvas.x - animationOutProgressInWidth}

				gsap.set(object, { left: startPosition.left })
				this.timeline.add(
					gsap.to(object, {
						duration,
						left: targetPosition.left,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}

			case "fadeIn": {
				gsap.set(object, { opacity: 0 })
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						opacity: 1,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "fadeOut": {
				gsap.set(object, { opacity: 1 })
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						opacity: 0,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}

			case "spinIn": {
				object.set({ originX: "center", originY: "center" })
				gsap.set(object, { angle: -180 })
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						angle: 0,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll(),
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "spinOut": {
				object.set({ originX: "center", originY: "center" })
				gsap.set(object, { angle: 0 })
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						angle: 180,
						ease: "linear",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}

			case "bounceIn": {
				const startPosition = { left: -effect.rect.width }
				const targetPosition = { left: effect.rect.position_on_canvas.x }
				gsap.set(object, { left: startPosition.left })
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						left: targetPosition.left,
						ease: "bounce.out",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "bounceOut": {
				const startPosition = { left: effect.rect.position_on_canvas.x }
				const targetPosition = { left: this.compositor.canvas.width + effect.rect.width }
				gsap.set(object, { left: startPosition.left })
				this.timeline.add(
					gsap.to(object, {
						duration: 1,
						left: targetPosition.left,
						ease: "bounce.in",
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}

			case "wipeIn": {
				const fullWidth = object.width
				const fullHeight = object.height
				const clipRect = new Rect({
					left: 0,
					top: 0,
					width: 0,
					height: fullHeight,
					absolutePositioned: true
				})
				object.set({ clipPath: clipRect })
				this.timeline.add(
					gsap.to(clipRect, {
						duration: 1,
						width: fullWidth,
						ease: "linear",
						onUpdate: () => {
							object.set({ clipPath: clipRect })
							this.compositor.canvas.renderAll()
						}
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "wipeOut": {
				const fullWidth = object.width
				const fullHeight = object.height
				const clipRect = new Rect({
					left: 0,
					top: 0,
					width: fullWidth,
					height: fullHeight,
					absolutePositioned: true
				})
				object.set({ clipPath: clipRect })
				this.timeline.add(
					gsap.to(clipRect, {
						duration: 1,
						width: 0,
						ease: "linear",
						onUpdate: () => {
							object.set({ clipPath: clipRect })
							this.compositor.canvas.renderAll()
						}
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}

			case "blurIn": {
				const blurFilter = new filters.Blur({ blur: 1 })
				blurFilter.for = "animation"
				//@ts-ignore
				object.filters.push(blurFilter)
				object.applyFilters()
				this.timeline.add(
					gsap.to(blurFilter, {
						duration: 1,
						blur: 0,
						ease: "linear",
						onUpdate: () => {
							object.applyFilters()
							this.compositor.canvas.renderAll()
						}
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "blurOut": {
				const blurFilter = new filters.Blur({ blur: 0 })
				blurFilter.for = "animation"
				//@ts-ignore
				object.filters.push(blurFilter)
				object.applyFilters()
				this.timeline.add(
					gsap.to(blurFilter, {
						duration: 1,
						blur: 1,
						ease: "linear",
						onUpdate: () => {
							object.applyFilters()
							this.compositor.canvas.renderAll()
						}
					}),
					(effect.start_at_position + (effect.end - effect.start) - 1000) / 1000
				)

				break
			}
		}

		await this.compositor.seek(state.timecode, true)
		this.onChange.publish(true)
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
		fabric.opacity = 1
	}

	deselectAnimation(effect: ImageEffect | VideoEffect, state: State, type: "In" | "Out") {
		const object = this.#getObject(effect)
		this.#resetObjectProperties(object!, effect)
		gsap.killTweensOf(object!)
		this.#animations = this.#animations.filter((animation) => !(animation.targetEffect.id === effect.id && animation.type.includes(type)))
		object!.filters = object!.filters.filter(f => f.for !== "animation")
		object!.applyFilters()
		this.refreshAnimations(state.effects, state)
		this.onChange.publish(true)
	}
}
