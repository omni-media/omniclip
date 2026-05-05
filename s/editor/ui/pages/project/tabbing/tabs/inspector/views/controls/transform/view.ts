
import {html} from 'lit'
import {shadow, useCss} from '@e280/sly'
import {Item, Kind} from '@omnimedia/omnitool'
import type {Transform} from '@omnimedia/omnitool/x/timeline/types.js'
import {resolveTransform} from '@omnimedia/omnitool/x/timeline/utils/anim.js'

import styleCss from './style.css.js'
import {add, update} from '../../../../../../../../logic/parts/mutate.js'
import keyframesSvg from '../../../../../../../../icons/keyframes.svg.js'
import {EditorContext} from '../../../../../../../../../context/context.js'
import rotateSvg from '../../../../../../../../icons/material-design-icons/rotate.svg.js'
import {ANIMATION_CHANNELS, getTrack, getSpatialAnimation, setAnimationKeyframe, SpatialLike, clamp, type AnimatableProperty} from '../animations/utils.js'

export const TransformControls = shadow((context: EditorContext, item: Item.Text | Item.Video) => {
	useCss(styleCss)

	const tool = context.omni
	const timeline = context.session.timeline
	const spatial = tool.require<SpatialLike>(item.spatialId)
	const laneStart = context.session.index.getItemLaneStart(item.id, context.session.$viewedItemId.value)
	const playhead = context.session.$playhead.value
	const localTime = clamp(playhead - laneStart, 0, item.duration)
	const animation = getSpatialAnimation(spatial)
	const [position, scale, rotation] = spatial
		? resolveTransform(spatial, localTime)
		: tool.transform()

	const hasKeyframeAtTime = (property: AnimatableProperty) =>
		!!animation && getTrack(animation, property).some(([time]) => time === localTime)

	const toggleKeyframe = (property: AnimatableProperty) => {
		if (!spatial)
			return

		const transform: Transform = [position, scale, rotation]
		context.session.updateTransformAnimation(spatial, transform, draft => {
			setAnimationKeyframe(draft, property, transform, localTime, !hasKeyframeAtTime(property))
		})
	}

	const updateTransform = (next: Transform) => {
		if (!spatial)
			return

		if (spatial.kind === Kind.Spatial) {
			tool.set<Item.Spatial>(spatial.id, {transform: next})
			return
		}

		context.session.updateTransformAnimation(spatial, next, draft => {
			for (const {path} of ANIMATION_CHANNELS)
				setAnimationKeyframe(draft, path, next, localTime)
		})
	}

	const onEnableTransform = (e: Event) => {
		const target = e.target as HTMLInputElement
		if(target.checked) {
			if(!spatial) {
				timeline.mutate(state => {
					const spatialId = tool.getId()
					add(state, {
						id: spatialId,
						kind: Kind.Spatial,
						transform: tool.transform(),
						enabled: true,
					})
					update(state, item.id, {spatialId})
				})
			} else tool.set(spatial.id, {enabled: true})
		} else if(spatial) {
			tool.set(spatial.id, {enabled: false})
		}
	}

	const renderKeyframeToggle = (property: AnimatableProperty) => html`
		<button
			type="button"
			class="keyframe-toggle"
			?data-active=${hasKeyframeAtTime(property)}
			@click=${() => toggleKeyframe(property)}
			title=${hasKeyframeAtTime(property)
				? `Remove keyframe for this property`
				: `Add keyframe for this property`}
		>
			${keyframesSvg}
		</button>
	`

	return html`
		<div>
			<input @change=${onEnableTransform} id="transform" type="checkbox" .checked=${!!spatial?.enabled} />
			<label for="transform">Transform</label>
		</div>
		<div class="transform-controls" ?data-disabled=${!spatial?.enabled}>
			<div class="control-row">
				<label>Position</label>
				${renderKeyframeToggle('position.x')}
				${renderKeyframeToggle('position.y')}
				<div class="inputs">
					<div class="input-group">
						<span class="prefix">X</span>
						<input
							type="number"
							.value=${position[0]}
							@input=${(e: InputEvent) =>
								updateTransform([[Number((e.target as HTMLInputElement).value), position[1]], scale, rotation])}
						>
					</div>
					<div class="input-group">
						<span class="prefix">Y</span>
						<input
							type="number"
							.value=${position[1]}
							@input=${(e: InputEvent) =>
								updateTransform([[position[0], Number((e.target as HTMLInputElement).value)], scale, rotation])}
						>
					</div>
				</div>
			</div>

			<div class="control-row">
				<label>Scale</label>
				${renderKeyframeToggle('scale.x')}
				${renderKeyframeToggle('scale.y')}
				<div class="inputs">
					<div class="input-group">
						<span class="prefix">X</span>
						<input
							type="number"
							step="0.01"
							.value=${scale[0]}
							@input=${(e: InputEvent) =>
								updateTransform([position, [Number((e.target as HTMLInputElement).value), scale[1]], rotation])}
						>
					</div>
					<div class="input-group">
						<span class="prefix">Y</span>
						<input
							type="number"
							step="0.01"
							.value=${scale[1]}
							@input=${(e: InputEvent) =>
								updateTransform([position, [scale[0], Number((e.target as HTMLInputElement).value)], rotation])}
						>
					</div>
				</div>
			</div>

			<div class="control-row">
				<label>Rotation</label>
				${renderKeyframeToggle('rotation')}
				<div class="inputs">
					<div class="input-group">
						<span class="prefix">${rotateSvg}</span>
						<input
							type="number"
							.value=${rotation}
							@input=${(e: InputEvent) =>
								updateTransform([position, scale, Number((e.target as HTMLInputElement).value)])}
						>
						<span class="suffix">°</span>
					</div>
				</div>
			</div>
		</div>
	`
})
