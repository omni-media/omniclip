import {pub} from "@benev/slate"
import {At, Grabbed} from "../../../../types.js"

export interface EffectDrop {
	grabbed: Grabbed
	position: At
}

export interface EffectDrag {
	grabbed: Grabbed
	position: At
}

export class EffectDragHandler {
	at: At | null = null
	grabbed: null | Grabbed = null
	#isGrabbed = false
	onEffectDrag = pub<EffectDrag>()
	onDrop = pub<EffectDrop>()

	move(position: At) {
		if (this.#isGrabbed && this.grabbed) {
			this.onEffectDrag.publish({ position, grabbed: this.grabbed })
			this.at = position
		}
	}

	start(grabbed: Grabbed, at: At) {
		this.#isGrabbed = true
		this.grabbed = grabbed
		this.at = at
	}

	drop(e: PointerEvent) {
		if(this.grabbed) {
			const path = e.composedPath()
			const indicator = path.find(e => (e as HTMLElement).className === "indicator-area") as HTMLElement | undefined
			this.onDrop.publish({grabbed: this.grabbed!, position: {...this.at!,
				indicator: indicator
					? {type: "addTrack", index: Number(indicator.getAttribute("data-index"))}
					: null
			}})
			this.#resetState()
		}
	}

	end() {
		if(this.grabbed) {
			this.onDrop.publish({grabbed: this.grabbed!, position: this.at!})
			this.#resetState()
		}
	}

	#resetState() {
		this.grabbed = null
		this.#isGrabbed = false
		this.at = null
	}
}
