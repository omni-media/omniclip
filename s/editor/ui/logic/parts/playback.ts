
import {signal} from "@e280/strata"
import {VideoPlayer} from "@omnimedia/omnitool"

const playbackRates = [1, 2, 4]

export class Playback {
	$isPlaying = signal(false)
	$rate = signal(1)

	constructor(private player: VideoPlayer) {}

	pause() {
		this.player.pause()
		this.player.playbackRate = 1
		this.$isPlaying.value = false
		this.$rate.value = 1
	}

	seek(time: number) {
		this.pause()
		return this.player.seek(time)
	}

	toggle() {
		if (this.$isPlaying.value) {
			this.pause()
			return
		}

		this.player.playbackRate = 1
		this.player.play()
		this.$isPlaying.value = true
		this.$rate.value = 1
	}

	shuttle(direction: -1 | 1) {
		const current = this.$isPlaying.value ? this.$rate.value : 0
		const sameDirection = Math.sign(current) === direction
		const absRate = sameDirection ? Math.abs(current) : 0
		const rate = playbackRates.find(rate => rate > absRate) ?? playbackRates[playbackRates.length - 1]

		this.player.playbackRate = rate * direction
		this.player.play()
		this.$isPlaying.value = true
		this.$rate.value = rate * direction
	}

}
