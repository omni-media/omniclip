export class FPSCounter {
	last_frame_time = performance.now()
	accumulated_time = 0

	constructor(
		private setter: (fps: number) => void,
		private update_every: number
	) {}

	update() {
		const currentTime = performance.now()
		const deltaTime = currentTime - this.last_frame_time
		this.last_frame_time = currentTime
		this.accumulated_time += deltaTime
		if(this.accumulated_time >= this.update_every) {
			const fps = Math.round(1000 / deltaTime)
			this.setter(fps)
			this.accumulated_time = 0
		}
	}

}
