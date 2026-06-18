
import {Ms} from '@omnimedia/omnitool/x/units/ms.js'

export function formatTime(time: Ms, options: {milliseconds?: boolean} = {}) {
	const totalSeconds = time / 1000
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.floor(totalSeconds % 60)
	const base = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

	if (!options.milliseconds)
		return base

	const milliseconds = Math.floor(time % 1000)
	return `${base}.${milliseconds.toString().padStart(3, '0')}`
}
