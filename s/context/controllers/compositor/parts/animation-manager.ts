import gsap from "gsap"
import {pub} from "@benev/slate"
import {FabricImage, FabricObject, ImageProps, Rect, filters} from "fabric"

import {Compositor} from "../controller.js"
import {Actions} from "../../../actions.js"
import {omnislate} from "../../../context.js"
import {AnyEffect, ImageEffect, State, VideoEffect} from "../../../types.js"
import {calculateProjectDuration} from "../../../../utils/calculate-project-duration.js"

interface AnimationBase<T = AnimationIn | AnimationOut> {
	targetEffect: VideoEffect | ImageEffect
	name: T
	type: "in" | "out"
	duration: number
	for: AnimationFor
}

export const animationNone = "none" as const
export const animationIn = ["slide-in", "fade-in", "spin-in", "bounce-in", "wipe-in", "blur-in", "zoom-in"] as const
export const animationOut = ["slide-out", "fade-out", "spin-out", "bounce-out", "wipe-out", "blur-out", "zoom-out"] as const
export type AnimationIn = AnimationBase<(typeof animationIn)[number]>
export type AnimationOut = AnimationBase<(typeof animationOut)[number]>
export type AnimationNone = AnimationBase<(typeof animationNone)[number]>
export type Animation = AnimationIn | AnimationOut
export type UpdatedProps = {
	effect: ImageEffect | VideoEffect
	duration: number
	kind?: "in" | "out"
}
export type AnimationFor = "Animation" | "Transition"

export class AnimationManager {
	timeline = gsap.timeline({
		duration: 10, // GSAP uses seconds instead of milliseconds
		paused: true,
	})

	#animations: Animation[] = []
	onChange = pub()

	constructor(private compositor: Compositor, protected actions: Actions, protected animationFor: AnimationFor) {}

	clearAnimations(omit?: boolean) {
		this.#animations.forEach(a => {
			this.deselectAnimation(a.targetEffect, a.type)
		})
		this.#animations = []
		this.actions.clear_animations({omit})
		this.timeline.clear()
	}

	get animations() {
		return this.#animations
	}

	set animations(animations: Animation[]) {
		this.#animations = animations
	}

	protected getAnimations(effect: AnyEffect) {
		return omnislate.context.state.animations.filter(a => a.targetEffect.id === effect.id && a.for === this.animationFor)
	}

	protected getAnimation(effect: AnyEffect, kind: "in" | "out") {
		return omnislate.context.state.animations.find(a => a.targetEffect.id === effect.id && a.type === kind && this.animationFor === a.for)
	}

	protected getAnyAnimation(effect: AnyEffect) {
		return omnislate.context.state.animations.find(a => a.targetEffect.id === effect.id && a.for === this.animationFor)
	}

	selectedAnimationForEffect(effect: AnyEffect | null, animation: Animation) {
		if (!effect) return
		const haveAnimation = this.#animations.find(anim => anim.targetEffect.id === effect.id && animation.name === anim.name && anim.for === this.animationFor)
		return !!haveAnimation
	}

	isAnyAnimationInSelected(effect: AnyEffect | null) {
		if (!effect) return false
		const haveAnimation = this.#animations.find(animation => animation.targetEffect.id === effect.id && animation.type === "in" && animation.for === this.animationFor)
		return !!haveAnimation
	}

	isAnyAnimationOutSelected(effect: AnyEffect | null) {
		if (!effect) return false
		const haveAnimation = this.#animations.find(animation => animation.targetEffect.id === effect.id && animation.type === "out" && animation.for === this.animationFor)
		return !!haveAnimation
	}

	updateTimelineDuration(duration: number) {
		this.timeline.duration(duration / 1000)
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

	updateAnimation(updatedProps: UpdatedProps) {
		this.actions.set_animation_duration(updatedProps.duration, updatedProps.effect, this.animationFor)
	}

	async refresh(state: State) {
		this.timeline.clear()
		this.#animations = state.animations.filter(a => a.for === this.animationFor).map(animation => {
			const effect = state.effects.find(effect => effect.id === animation.targetEffect.id) as ImageEffect | VideoEffect | undefined
			return {
				...animation,
				targetEffect: effect ?? animation.targetEffect,
			}
		})
		await Promise.all(
			this.#animations.map(async animation => {
				await this.deselectAnimation(
					animation.targetEffect,
					animation.type,
					true
				)
				await this.selectAnimation(
					animation.targetEffect,
					animation,
					state,
					true
				)
			})
		)
		this.compositor.compose_effects(state.effects, state.timecode)
	}

	#onAnimationUpdate(object: FabricObject, animation: Animation) {
		const tween = this.timeline.getTweensOf(object).find(a => a.vars.animationName === animation.type)
		if (!tween) return
		const isAnimating = tween.progress() < 1 && tween.progress() > 0
		if (isAnimating) {
			if (object.selectable && object.evented) {
				this.compositor.canvas.discardActiveObject()
				object.selectable = false
				object.evented = false
			}
		} else {
			if (!object.selectable && !object.evented) {
				this.compositor.canvas.setActiveObject(object)
				object.selectable = true
				object.evented = true
			}
		}
		this.compositor.canvas.renderAll()
	}

	getAnimationDuration(effect: AnyEffect, kind: "in" | "out") {
		const animation = this.getAnimation(effect, kind)
		return animation?.duration
	}

	async selectAnimation(
		effect: ImageEffect | VideoEffect,
		animation: Animation,
		state: State,
		recreate?: boolean,
		omit?: boolean
	) {
		const alreadySelected = this.#animations.find(a => a.targetEffect.id === effect.id && a.name === animation.name)
		if (alreadySelected) return

		const differentAnimation = this.#animations.find(a => a.targetEffect.id === effect.id && a.type === animation.type)
		if (differentAnimation) {
			await this.deselectAnimation(effect, animation.type)
		}

		if (state) {
			this.timeline.duration(calculateProjectDuration(state.effects) / 1000)
		}

		const object = this.#getObject(effect)!
		if (!recreate) {
			this.actions.add_animation(animation, this.animationFor, {omit})
		}
		this.#animations.push(animation)

		await this.compositor.seek(state.timecode, true)
		const transitionDurations = animation.for === "Animation"
			? { incoming: 0, outgoing: 0 }
			: this.compositor.managers.transitionManager.getTransitionDuration(effect)
		const tweenDuration = animation.duration / 1000
		let tweenInfo

		switch (animation.name) {
			case "slide-in":
				tweenInfo = this.#handleSlideIn(object, effect, animation, tweenDuration)
				break
			case "slide-out":
				tweenInfo = this.#handleSlideOut(object, effect, animation, tweenDuration)
				break
			case "fade-in":
				tweenInfo = this.#handleFadeIn(object, effect, animation, tweenDuration, transitionDurations.incoming)
				break
			case "fade-out":
				tweenInfo = this.#handleFadeOut(object, effect, animation, tweenDuration, transitionDurations.outgoing)
				break
			case "spin-in":
				tweenInfo = this.#handleSpinIn(object, effect, animation, tweenDuration)
				break
			case "spin-out":
				tweenInfo = this.#handleSpinOut(object, effect, animation, tweenDuration)
				break
			case "bounce-in":
				tweenInfo = this.#handleBounceIn(object, effect, animation, tweenDuration)
				break
			case "bounce-out":
				tweenInfo = this.#handleBounceOut(object, effect, animation, tweenDuration)
				break
			case "wipe-in":
				tweenInfo = this.#handleWipeIn(object, effect, animation, tweenDuration)
				break
			case "wipe-out":
				tweenInfo = this.#handleWipeOut(object, effect, animation, tweenDuration)
				break
			case "blur-in":
				tweenInfo = this.#handleBlurIn(object, effect, animation, tweenDuration)
				break
			case "blur-out":
				tweenInfo = this.#handleBlurOut(object, effect, animation, tweenDuration)
				break
			case "zoom-in":
				tweenInfo = this.#handleZoomIn(object, effect, animation, tweenDuration)
				break
			case "zoom-out":
				tweenInfo = this.#handleZoomOut(object, effect, animation, tweenDuration)
				break
			default:
				return
		}

		this.timeline.add(tweenInfo.tween, tweenInfo.startTime)
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
		animations.forEach(a => this.deselectAnimation(a.targetEffect, a.type))
	}

	removeAnimation(state: State, effect: ImageEffect | VideoEffect, type: "in" | "out", refresh?: boolean, omit?: boolean) {
		this.deselectAnimation(effect, type, refresh, omit)
		this.refresh(state)
	}

	#killAnimationTweens(object: FabricImage<Partial<ImageProps>>) {
		const tweens = gsap.getTweensOf(object)
		tweens.forEach(tween => {
			if (tween.vars.data && tween.vars.data.animationFor === this.animationFor) {
				tween.kill()
			}
		})
	}

	async deselectAnimation(effect: ImageEffect | VideoEffect, type: "in" | "out", refresh?: boolean, omit?: boolean) {
		return new Promise(resolve => {
			gsap.ticker.add(() => {
				const object = this.#getObject(effect)
				if (object) {
					this.#resetObjectProperties(object, effect)
					this.#killAnimationTweens(object)
					this.#animations = this.#animations.filter(animation => !(animation.targetEffect.id === effect.id && animation.type === type))
					if (!refresh) {this.actions.remove_animation(effect, type, this.animationFor, {omit})}
					object.filters = object.filters.filter(f => f.for !== "animation")
					object.applyFilters()
					this.compositor.canvas.renderAll()
				}
				this.onChange.publish(true)
				resolve(true)
			}, true)
		})
	}

	// Animation handler methods

	#handleSlideIn(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const targetLeft = effect.rect.position_on_canvas.x
		const startLeft = targetLeft - effect.rect.width
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				left: startLeft,
				ease: "linear",
			},
			{
				left: targetLeft,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			}
		)
		const startTime = effect.start_at_position / 1000
		return {tween, startTime}
	}

	#handleSlideOut(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const startLeft = effect.rect.position_on_canvas.x
		const targetLeft = startLeft + effect.rect.width
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				left: startLeft,
				ease: "linear",
			},
			{
				left: targetLeft,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			}
		)
		const startTime = (effect.start_at_position + (effect.end - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}

	#handleFadeIn(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number, incoming: number) {
		const tween = gsap.fromTo(
			object,
			{
				opacity: 0,
				ease: "linear",
			},
			{
				opacity: 1,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.compositor.canvas.renderAll()
			}
		)
		const startTime = (effect.start_at_position - incoming) / 1000
		return {tween, startTime}
	}

	#handleFadeOut(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number, outgoing: number) {
		const tween = gsap.fromTo(
			object,
			{
				opacity: 1,
				ease: "linear",
			},
			{
				opacity: 0,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.compositor.canvas.renderAll()
			}
		)
		const startTime = (effect.start_at_position + (effect.end + outgoing - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}

	#handleSpinIn(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		object.set({ originX: "center", originY: "center" })
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				angle: -180,
				ease: "linear",
			},
			{
				angle: 0,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			}
		)
		const startTime = effect.start_at_position / 1000
		return {tween, startTime}
	}

	#handleSpinOut(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		object.set({ originX: "center", originY: "center" })
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				angle: 0,
				ease: "linear",
			},
			{
				angle: 180,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			}
		)
		const startTime = (effect.start_at_position + (effect.end - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}

	#handleBounceIn(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const startLeft = -effect.rect.width
		const targetLeft = effect.rect.position_on_canvas.x
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				left: startLeft,
				ease: "bounce.out",
			},
			{
				left: targetLeft,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			}
		)
		const startTime = effect.start_at_position / 1000
		return {tween, startTime}
	}

	#handleBounceOut(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const startLeft = effect.rect.position_on_canvas.x
		const targetLeft = this.compositor.canvas.width + effect.rect.width
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				left: startLeft,
				ease: "bounce.in",
			},
			{
				left: targetLeft,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			}
		)
		const startTime = (effect.start_at_position + (effect.end - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}

	#handleWipeIn(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const fullWidth = object.width
		const fullHeight = object.height
		const clipRect = new Rect({
			left: 0,
			top: 0,
			width: 0,
			height: fullHeight,
			absolutePositioned: true,
		})
		object.set({ clipPath: clipRect })
		const tween = gsap.to(clipRect, {
			duration: tweenDuration,
			width: fullWidth,
			ease: "linear",
			data: {animationFor: this.animationFor},
			onUpdate: () => {
				object.set({ clipPath: clipRect })
				this.compositor.canvas.renderAll()
			},
		})
		const startTime = effect.start_at_position / 1000
		return {tween, startTime}
	}

	#handleWipeOut(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const fullWidth = object.width
		const fullHeight = object.height
		const clipRect = new Rect({
			left: 0,
			top: 0,
			width: fullWidth,
			height: fullHeight,
			absolutePositioned: true,
		})
		object.set({ clipPath: clipRect })
		const tween = gsap.to(clipRect, {
			duration: tweenDuration,
			width: 0,
			ease: "linear",
			data: {animationFor: this.animationFor},
			onUpdate: () => {
				object.set({ clipPath: clipRect })
				this.compositor.canvas.renderAll()
			},
		})
		const startTime = (effect.start_at_position + (effect.end - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}

	#handleBlurIn(object: FabricImage<Partial<ImageProps>>, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const blurFilter = new filters.Blur({ blur: 1 })
		blurFilter.for = "animation"
		// @ts-ignore
		object.filters.push(blurFilter)
		object.applyFilters()
		const tween = gsap.to(blurFilter, {
			duration: tweenDuration,
			blur: 0,
			ease: "linear",
			data: {animationFor: this.animationFor},
			onUpdate: () => {
				object.applyFilters()
				this.compositor.canvas.renderAll()
			},
		})
		const startTime = effect.start_at_position / 1000
		return {tween, startTime}
	}

	#handleBlurOut(object: FabricImage<Partial<ImageProps>>, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const blurFilter = new filters.Blur({ blur: 0 })
		blurFilter.for = "animation"
		// @ts-ignore
		object.filters.push(blurFilter)
		object.applyFilters()
		const tween = gsap.to(blurFilter, {
			duration: tweenDuration,
			blur: 1,
			ease: "linear",
			data: {animationFor: this.animationFor},
			onUpdate: () => {
				object.applyFilters()
				this.compositor.canvas.renderAll()
			},
		})
		const startTime = (effect.start_at_position + (effect.end - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}

	#handleZoomIn(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const originalLeft = object.left
		const originalTop = object.top
		const originalWidth = object.getScaledWidth()
		const originalHeight = object.getScaledHeight()
		if (object.originX !== "center" || object.originY !== "center") {
			object.set({
				originX: "center",
				originY: "center",
			})
			object.left = originalLeft + originalWidth / 2
			object.top = originalTop + originalHeight / 2
		}
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				scaleX: 0.5,
				scaleY: 0.5,
				ease: "linear",
			},
			{
				scaleX: 1,
				scaleY: 1,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			},
		)
		const startTime = effect.start_at_position / 1000
		return {tween, startTime}
	}

	#handleZoomOut(object: FabricObject, effect: ImageEffect | VideoEffect, animation: Animation, tweenDuration: number) {
		const originalLeft = object.left
		const originalTop = object.top
		const originalWidth = object.getScaledWidth()
		const originalHeight = object.getScaledHeight()
		if (object.originX !== "center" || object.originY !== "center") {
			object.set({
				originX: "center",
				originY: "center",
			})
			object.left = originalLeft + originalWidth / 2
			object.top = originalTop + originalHeight / 2
		}
		const tween = gsap.fromTo(
			object,
			{
				animationName: animation.type,
				scaleX: 1,
				scaleY: 1,
				ease: "linear",
			},
			{
				scaleX: 0.5,
				scaleY: 0.5,
				duration: tweenDuration,
				data: {animationFor: this.animationFor},
				onUpdate: () => this.#onAnimationUpdate(object, animation),
			},
		)
		const startTime = (effect.start_at_position + (effect.end - effect.start) - animation.duration) / 1000
		return {tween, startTime}
	}
}
