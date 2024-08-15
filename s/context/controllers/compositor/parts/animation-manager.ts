import anime from "animejs/lib/anime.es.js"
import {Compositor} from "../controller.js"
import {ImageEffect, VideoEffect} from "../../../types.js"

export const animationIn = ["slideIn"] as const
export const animationOut = ["slideOut"] as const
export type AnimationIn = (typeof animationIn)[number]
export type AnimationOut = (typeof animationOut)[number]

export class AnimationManager {
	timeline = anime.timeline({
		duration: 10000,
		autoplay: false,
	})

	constructor(private compositor: Compositor) {}

	updateTimelineDuration(duration: number) {
		this.timeline.duration = duration
	}

	#getObject(effect: VideoEffect | ImageEffect) {
		return this.compositor.canvas.getObjects().find((object) => {
			//@ts-ignore
			const effectObject = object.effect as ImageEffect | VideoEffect
			if (effect.id === effectObject?.id) {
				return object
			}
		})
	}

	addAnimationToObject(
		effect: ImageEffect | VideoEffect,
		animation: AnimationIn | AnimationOut,
	) {
		const object = this.#getObject(effect)
		switch (animation) {
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
	}

	play() {
		this.timeline.play()
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

	removeAnimationFromObject(effect: ImageEffect | VideoEffect) {
		const object = this.#getObject(effect)
		anime.remove(object!)
	}
}
