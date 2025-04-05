import {pub} from "@benev/slate"

export class PlayheadDrag {
	#lastTime = 0
	#pauseTime = 0

	grabbed = false
	onPlayheadMoveThrottled = pub<{x: number}>()
	onPlayheadMove = pub<{x: number}>()

	move(x: number) {
		if(this.grabbed) {
			this.#throttle(() => this.onPlayheadMoveThrottled.publish({x}), 200)
			this.onPlayheadMove.publish({x})
		} else {
			this.#pauseTime = performance.now() - this.#lastTime
		}
	}

	start() {
		this.grabbed = true
	}

	drop() {
		if(this.grabbed) {
			this.grabbed = false
		}
	}

	end() {
		if(this.grabbed) {
			this.grabbed = false
		}
	}

	#throttle(callback: () => void, delay: number) {
		const time = performance.now() - this.#pauseTime
		const wait_time = time - this.#lastTime
		if(wait_time > delay) {
			callback()
			this.#lastTime = time
		}
	}
}
