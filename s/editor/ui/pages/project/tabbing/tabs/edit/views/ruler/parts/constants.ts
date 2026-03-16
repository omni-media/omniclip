
import {Fps} from '@omnimedia/omnitool/x/units/fps.js'
import {ms} from '@omnimedia/omnitool/x/units/ms.js'

export const tickSteps = (timebase: Fps) => [
	{major: ms(1000), minor: ms(1000 / timebase)},
	{major: ms(2000), minor: ms(1000)},
	{major: ms(5000), minor: ms(1000)},
	{major: ms(10000), minor: ms(1000)},
	{major: ms(15000), minor: ms(5000)},
	{major: ms(30000), minor: ms(10000)},
	{major: ms(60000), minor: ms(15000)},
	{major: ms(120000), minor: ms(30000)},
	{major: ms(300000), minor: ms(60000)},
	{major: ms(600000), minor: ms(60000)},
	{major: ms(1800000), minor: ms(300000)},
	{major: ms(3600000), minor: ms(900000)}
]
