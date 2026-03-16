
import {Ms} from '@omnimedia/omnitool/x/units/ms.js'

export function formatTime(time: Ms) {
	const totalSeconds = time / 1000
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.floor(totalSeconds % 60)
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

