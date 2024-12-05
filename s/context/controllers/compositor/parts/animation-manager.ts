import gsap from "gsap"
import {pub} from "@benev/slate"
import {FabricObject, Rect, filters} from "fabric"

import {Compositor} from "../controller.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"
import {calculateProjectDuration} from "../../../../utils/calculate-project-duration.js"

interface AnimationBase<T = AnimationIn | AnimationOut> {
	targetEffect: VideoEffect | ImageEffect
	name: T
	type: "in" | "out"
	duration: number
}
export const animationNone = "none" as const
export const animationIn = ["slide-in", "fade-in", "spin-in", "bounce-in", "wipe-in", "blur-in", "zoom-in"] as const
export const animationOut = ["slide-out", "fade-out", "spin-out", "bounce-out", "wipe-out", "blur-out", "zoom-out"] as const
export type AnimationIn = AnimationBase<(typeof animationIn)[number]>
export type AnimationOut = AnimationBase<(typeof animationOut)[number]>
export type AnimationNone = AnimationBase<(typeof animationNone)[number]>
export type Animation = AnimationIn | AnimationOut
export type UpdatedProps = {
	duration: number
	kind?: "in" | "out"
}

export class AnimationManager {
	timeline = gsap.timeline({
		duration: 10, // GSAP uses seconds instead of milliseconds
		paused: true,
	})

	#animations: Animation[] = []
	onChange = pub()

	constructor(private compositor: Compositor, private kind?: string) {}

	clearAnimations() {
		this.#animations = []
		this.#animations.forEach(a => this.deselectAnimation(a.targetEffect, a.type))
		this.timeline.clear()
	}

	get animations() {
		return this.#animations
	}

	set animations(animations: Animation[]) {
		this.animations = animations
	}

	protected getAnimations(effect: AnyEffect) {
		return this.#animations.filter(a => a.targetEffect.id === effect.id)
	}

	protected getAnimation(effect: AnyEffect, kind: "in" | "out") {
		return this.#animations.find(a => a.targetEffect.id === effect.id && a.type === kind)
	}

	protected getAnyAnimation(effect: AnyEffect) {
		return this.#animations.find(a => a.targetEffect.id === effect.id)
	}

	selectedAnimationForEffect(effect: AnyEffect | null, animation: Animation) {
		if (!effect) return
		const haveAnimation = this.#animations.find(
			(anim) => anim.targetEffect.id === effect.id && animation.name === anim.name
		)
		return !!haveAnimation
	}

	isAnyAnimationInSelected(effect: AnyEffect | null) {
		if (!effect) return false
		const haveAnimation = this.#animations.find(
			(animation) => animation.targetEffect.id === effect.id && animation.type === "in"
		)
		return !!haveAnimation
	}

	isAnyAnimationOutSelected(effect: AnyEffect | null) {
		if (!effect) return false
		const haveAnimation = this.#animations.find(
			(animation) => animation.targetEffect.id === effect.id && animation.type === "out"
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

	async refresh(state: State, updatedProps?: UpdatedProps) {
		this.timeline.clear()
		const updated = this.#animations.map((animation) => {
			const effect = state.effects.find((effect) => effect.id === animation.targetEffect.id) as ImageEffect | VideoEffect | undefined
			return {
				...animation,
				targetEffect: effect ?? animation.targetEffect,
			}
		})
		this.#animations = updated
		await Promise.all(this.#animations.map(async (animation) => {
			await this.deselectAnimation(
				animation.targetEffect,
				animation.type,
			)
			await this.selectAnimation(
				animation.targetEffect,
				updatedProps
					? this.#refreshAnimation(updatedProps, animation)
					: animation,
				state
			)
		}))
	}

	#refreshAnimation({kind, duration}: UpdatedProps, animation: Animation): Animation {
		if(!kind) {
			// updating both if no kind
			return {...animation, duration}
		}
		if(animation.type.includes(kind)) {
			return {...animation, duration}
		} else return animation
	}

	#onAnimationUpdate(object: FabricObject, animationName: Animation) {
		const animation = this.timeline.getTweensOf(object).find(a => a.vars.animationName === animationName.type)
		if(!animation) return
		const isAnimating = animation.progress() < 1 && animation.progress() > 0
		if(isAnimating) {
			if(object.selectable && object.evented) {
				this.compositor.canvas.discardActiveObject()
				object.selectable = false
				object.evented = false
			}
		} else {
			if(!object.selectable && !object.evented) {
				this.compositor.canvas.setActiveObject(object)
				object.selectable = true
				object.evented = true
			}
		}
		this.compositor.canvas.renderAll()
	}

	async selectAnimation(
		effect: ImageEffect | VideoEffect,
		animation: Animation,
		state: State
	) {
		const alreadySelected = this.#animations.find(a => a.targetEffect.id === effect.id && a.name === animation.name)
		if(alreadySelected) {
			return
		}

		const isDifferentAnimationSelected = this.#animations.find(a => a.targetEffect.id === effect.id && a.type === animation.type)
		if(isDifferentAnimationSelected) {
			// deselect current animation
			await this.deselectAnimation(effect, animation.type)
			// continue with selecting different animation
		}

		if (state) {
			this.timeline.duration(calculateProjectDuration(state.effects) / 1000)
		}

		const object = this.#getObject(effect)!
		this.#animations.push(animation)

		await this.compositor.seek(state.timecode, true)
		const {incoming, outgoing} = this.compositor.managers.transitionManager.getTransitionDuration(effect)

		switch (animation.name) {
			case "slide-in": {
				const targetPosition = {left: effect.rect.position_on_canvas.x}
				const startPosition = {left: effect.rect.position_on_canvas.x - effect.rect.width}

				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						left: startPosition.left,
						ease: "linear",
					}, {
						left: targetPosition.left,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					effect.start_at_position / 1000
				)
				break
			}

			case "slide-out": {
				const targetPosition = {left: effect.rect.position_on_canvas.x + effect.rect.width}
				const startPosition = {left: effect.rect.position_on_canvas.x}

				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						left: startPosition.left,
						ease: "linear",
					}, {
						left: targetPosition.left,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					(effect.start_at_position + (effect.end - effect.start) - animation.duration * 1000) / 1000
				)

				break
			}

			case "fade-in": {
				this.timeline.add(
					gsap.fromTo(object, {
						opacity: 0,
						ease: "linear",
					}, {
						opacity: 1,
						duration: animation.duration,
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position - incoming) / 1000
				)

				break
			}

			case "fade-out": {
				this.timeline.add(
					gsap.fromTo(object, {
						opacity: 1,
						ease: "linear",
					}, {
						opacity: 0,
						duration: animation.duration,
						onUpdate: () => this.compositor.canvas.renderAll()
					}),
					(effect.start_at_position + (effect.end + outgoing - effect.start) - animation.duration * 1000) / 1000
				)

				break
			}

			case "spin-in": {
				object.set({ originX: "center", originY: "center" })
				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						angle: -180,
						ease: "linear",
					}, {
						angle: 0,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "spin-out": {
				object.set({ originX: "center", originY: "center" })
				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						angle: 0,
						ease: "linear",
					}, {
						angle: 180,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					(effect.start_at_position + (effect.end - effect.start) - animation.duration * 1000) / 1000
				)

				break
			}

			case "bounce-in": {
				const startPosition = { left: -effect.rect.width }
				const targetPosition = { left: effect.rect.position_on_canvas.x }
				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						left: startPosition.left,
						ease: "bounce.out",
					}, {
						left: targetPosition.left,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "bounce-out": {
				const startPosition = { left: effect.rect.position_on_canvas.x }
				const targetPosition = { left: this.compositor.canvas.width + effect.rect.width }
				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						left: startPosition.left,
						ease: "bounce.in",
					}, {
						left: targetPosition.left,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					(effect.start_at_position + (effect.end - effect.start) - animation.duration * 1000) / 1000
				)

				break
			}

			case "wipe-in": {
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
						duration: animation.duration,
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

			case "wipe-out": {
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
						duration: animation.duration,
						width: 0,
						ease: "linear",
						onUpdate: () => {
							object.set({ clipPath: clipRect })
							this.compositor.canvas.renderAll()
						}
					}),
					(effect.start_at_position + (effect.end - effect.start) - animation.duration * 1000) / 1000
				)

				break
			}

			case "blur-in": {
				const blurFilter = new filters.Blur({ blur: 1 })
				blurFilter.for = "animation"
				//@ts-ignore
				object.filters.push(blurFilter)
				object.applyFilters()
				this.timeline.add(
					gsap.to(blurFilter, {
						duration: animation.duration,
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

			case "blur-out": {
				const blurFilter = new filters.Blur({ blur: 0 })
				blurFilter.for = "animation"
				//@ts-ignore
				object.filters.push(blurFilter)
				object.applyFilters()
				this.timeline.add(
					gsap.to(blurFilter, {
						duration: animation.duration,
						blur: 1,
						ease: "linear",
						onUpdate: () => {
							object.applyFilters()
							this.compositor.canvas.renderAll()
						}
					}),
					(effect.start_at_position + (effect.end - effect.start) - animation.duration * 1000) / 1000
				)

				break
			}

			case "zoom-in": {
				const originalLeft = object.left
				const originalTop = object.top
				const originalWidth = object.getScaledWidth()
				const originalHeight = object.getScaledHeight()

				if(object.originX !== "center" && object.originY !== "center") {
					object.set({
						originX: "center",
						originY: "center"
					})

					object.left = originalLeft + originalWidth / 2
					object.top = originalTop + originalHeight / 2
				}

				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						scaleX: 0.5,
						scaleY: 0.5,
						ease: "linear",
					}, {
						scaleX: 1,
						scaleY: 1,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					effect.start_at_position / 1000
				)

				break
			}

			case "zoom-out": {
				const originalLeft = object.left
				const originalTop = object.top
				const originalWidth = object.getScaledWidth()
				const originalHeight = object.getScaledHeight()
				
				if(object.originX !== "center" && object.originY !== "center") {
					object.set({
						originX: "center",
						originY: "center"
					})

					object.left = originalLeft + originalWidth / 2
					object.top = originalTop + originalHeight / 2
				}

				this.timeline.add(
					gsap.fromTo(object, {
						animationName: animation.type,
						scaleX: 1,
						scaleY: 1,
						ease: "linear",
					}, {
						scaleX: 0.5,
						scaleY: 0.5,
						duration: animation.duration,
						onUpdate: () => this.#onAnimationUpdate(object, animation)
					}),
					(effect.start_at_position + (effect.end - effect.start) - animation.duration * 1000) / 1000
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

	removeAnimations(effect: AnyEffect) {
		const animations = this.getAnimations(effect)
		animations.map(a => this.deselectAnimation(a.targetEffect, a.type))
	}

	removeAnimation(state: State, effect: ImageEffect | VideoEffect, type: "in" | "out") {
		this.deselectAnimation(effect, type)
		this.refresh(state)
	}

	protected deselectAnimation(effect: ImageEffect | VideoEffect, type: "in" | "out") {
		return new Promise((resolve) => gsap.ticker.add(() => {
			const object = this.#getObject(effect)
			this.#resetObjectProperties(object!, effect)
			gsap.killTweensOf(object!)
			this.#animations = this.#animations.filter((animation) => !(animation.targetEffect.id === effect.id && animation.type === type))
			object!.filters = object!.filters.filter(f => f.for !== "animation")
			object!.applyFilters()
			this.onChange.publish(true)
			this.compositor.canvas.renderAll()
			resolve(true)
		}, true))
	}
}
