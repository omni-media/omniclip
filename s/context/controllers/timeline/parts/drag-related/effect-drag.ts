import {pub} from "@benev/slate"
import {At, Grabbed} from "../../../../types.js"

export class EffectDragHandler {
	at: At | null = null
	grabbed: null | Grabbed = null
	#isGrabbed = false
	onEffectDrag = pub<{ hovering: At; grabbed: Grabbed }>()
	onDrop = pub<{grabbed: Grabbed, droppedAt: At}>()

	move(hovering: At) {
		if (this.#isGrabbed && this.grabbed) {
			this.onEffectDrag.publish({ hovering, grabbed: this.grabbed })
			this.at = hovering
		}
	}

	start(grabbed: Grabbed, at: At) {
		this.#isGrabbed = true
		this.grabbed = grabbed
		this.at = at
	}

	drop() {
		if(this.grabbed) {
			this.onDrop.publish({grabbed: this.grabbed!, droppedAt: this.at!})
			this.#resetState()
		}
	}

	end() {
		if(this.grabbed) {
			this.onDrop.publish({grabbed: this.grabbed!, droppedAt: this.at!})
			this.#resetState()
		}
	}

	#resetState() {
		this.grabbed = null
		this.#isGrabbed = false
		this.at = null
	}
}
