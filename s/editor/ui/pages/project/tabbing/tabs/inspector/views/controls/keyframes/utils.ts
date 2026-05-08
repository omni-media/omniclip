
import {Item, visualAnimations} from '@omnimedia/omnitool'
import type {Keyframes, Transform, TransformAnimation} from '@omnimedia/omnitool/x/timeline/types.js'

export type SpatialLike = Item.Spatial
type TransformChannel = Extract<typeof visualAnimations.transform.channels[number], {readonly path: string}>

export const ANIMATION_CHANNELS = visualAnimations.transform.channels.filter(
	(channel): channel is TransformChannel => !!channel.path,
)
export type AnimatableProperty = TransformChannel['path']

const titleCase = (text: string) =>
	text.replaceAll('.', ' ').replace(/\b\w/g, letter => letter.toUpperCase())

const getByPath = <T>(source: unknown, path: string) =>
	path.split('.').reduce<any>((value, key) => value?.[key], source) as T

export const transformValues = ([position, scale, rotation]: Transform) =>
	({position: {x: position[0], y: position[1]}, scale: {x: scale[0], y: scale[1]}, rotation})

export const cloneAnimation = (animation: TransformAnimation) =>
	structuredClone(animation)

export const getTrack = (animation: TransformAnimation, property: AnimatableProperty) =>
	getByPath<Keyframes>(animation.track, property)

export const hasAnyKeyframes = (animation: TransformAnimation) =>
	ANIMATION_CHANNELS.some(({path}) => getTrack(animation, path).length)

export const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value))

export const getTransformValue = (transform: Transform, property: AnimatableProperty) =>
	getByPath<number>(transformValues(transform), property)

export const getAnimationRows = (animation: TransformAnimation | undefined, time: number) =>
	ANIMATION_CHANNELS.map(channel => {
		const keyframes = animation ? getTrack(animation, channel.path) : []
		return {
			channel,
			keyframes,
			label: titleCase(channel.path),
			active: keyframes.some(([keyframeTime]) => keyframeTime === time),
		}
	})

export const getKeyframeNav = (rows: readonly {keyframes: Keyframes}[], time: number) => {
	const times = [...new Set(rows.flatMap(({keyframes}) => keyframes.map(([keyframeTime]) => keyframeTime)))]
		.sort((a, b) => a - b)
	return {
		previousTime: times.findLast(keyframeTime => keyframeTime < time),
		nextTime: times.find(keyframeTime => keyframeTime > time),
		animatedCount: rows.filter(({keyframes}) => keyframes.length).length,
	}
}

export const setTrackKeyframe = (keyframes: Keyframes, time: number, value: number, enabled = true) => {
	const index = keyframes.findIndex(([keyframeTime]) => keyframeTime === time)
	if (!enabled) {
		if (index >= 0) keyframes.splice(index, 1)
		return
	}

	if (index >= 0) keyframes[index] = [time, value]
	else keyframes.push([time, value])
	keyframes.sort((a, b) => a[0] - b[0])
}

export const setAnimationKeyframe = (
	animation: TransformAnimation, property: AnimatableProperty, transform: Transform, time: number, enabled = true,
) => setTrackKeyframe(getTrack(animation, property), time, getTransformValue(transform, property), enabled)
