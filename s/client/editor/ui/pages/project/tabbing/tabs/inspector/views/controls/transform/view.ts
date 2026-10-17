
import {html} from 'lit'
import {shadow, useCss} from '@e280/sly'
import {Item, type Transform, resolveTransformAnimation, transform} from "@omnimedia/omnitool"

import styleCss from './style.css.js'
import {controlsStyles} from '../styles.css.js'
import type {Idx} from '../../../../../../../../logic/parts/index.js'
import keyframesSvg from '../../../../../../../../icons/keyframes.svg.js'
import {EditorContext} from '../../../../../../../../../context/context.js'
import rotateSvg from '../../../../../../../../icons/material-design-icons/rotate.svg.js'
import {ANIMATION_CHANNELS, getTrack, setAnimationKeyframe, SpatialLike, clamp, type AnimatableProperty} from '../keyframes/utils.js'

import "@awesome.me/webawesome/dist/components/icon/icon.js"
import "@awesome.me/webawesome/dist/components/number-input/number-input.js"

export const TransformControls = shadow((context: EditorContext, item: Item.Text | Idx.VideoItem | Item.Image) => {
	useCss(controlsStyles, styleCss)

	const session = context.session
	const index = context.session.index
	const spatial = index.getItemMaybe<SpatialLike>(item.spatialId)
	const preserveAspectRatio = context.session.stage.$preserveAspectRatio

	const animationItem = (item.animationIds ?? [])
		.map(id => index.getItemMaybe<Item.Animation>(id))
		.find(animation => animation?.anims.transform)

	const playhead = context.session.$playhead()
	const laneStart = context.session.index.getItemLaneStart(item.id, context.session.$viewedItemId())
	const localTime = clamp(playhead - laneStart, 0, item.duration)

	const animation = animationItem?.anims.transform

	const [position, scale, rotation] = spatial
		? animation ? resolveTransformAnimation(localTime, animation) : spatial.transform
		: transform()

	const hasKeyframeAtTime = (property: AnimatableProperty) =>
		!!animation && getTrack(animation, property).some(([time]) => time === localTime)

	const toggleKeyframe = (property: AnimatableProperty) => {
		const transform: Transform = [position, scale, rotation]
		context.session.updateTransformAnimation(item, transform, draft => {
			setAnimationKeyframe(draft, property, transform, localTime, !hasKeyframeAtTime(property))
		})
	}

	const updateTransform = (next: Transform) => {
		if (!spatial)
			return

		if (!animation) {
			session.edit(o => o.set<Item.Spatial>(spatial.id, {transform: next}))
			return
		}

		context.session.updateTransformAnimation(item, next, draft => {
			for (const {path} of ANIMATION_CHANNELS)
				setAnimationKeyframe(draft, path, next, localTime)
		})
	}

	const onEnableTransform = (e: Event) => {
		const target = e.target as HTMLInputElement
		if (!target.checked && !spatial) return
		session.edit(o => {
			if (!spatial) {
				const created = o.spatial()
				o.set(item.id, {spatialId: created.id})
				o.set(created.id, {enabled: true})
			} else o.set(spatial.id, {enabled: target.checked})
		})
	}

	const renderKeyframeToggle = (property: AnimatableProperty) => html`
		<button
			slot="end"
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

	const numberValue = (e: Event) => Number((e.target as HTMLInputElement).value)

	const updateScale = (value: number, axis: 0 | 1) => {
		const nextScale = [...scale] as [number, number]
		if (preserveAspectRatio())
			nextScale[1 - axis] *= value / (scale[axis] || value || 1)
		nextScale[axis] = value
		updateTransform([position, nextScale, rotation])
	}

	const toggleAspectRatioLock = () => preserveAspectRatio(!preserveAspectRatio())

	const renderReset = (label: string, reset: () => void) => html`
		<button
			type="button"
			class="transform-reset"
			@click=${reset}
			title=${`Reset ${label}`}
			aria-label=${`Reset ${label}`}
		>
			<wa-icon name="rotate-left"></wa-icon>
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
				<div class="inputs">
					<div class="input-group">
						<wa-number-input
							class="transform-input"
							size="small"
							without-steppers
							.value=${position[0].toFixed(2)}
							@input=${(e: Event) =>
								updateTransform([[numberValue(e), position[1]], scale, rotation])}
						>
							<span slot="start" class="prefix">X</span>
							${renderKeyframeToggle('position.x')}
						</wa-number-input>
					</div>
					<div class="input-group">
						<wa-number-input
							class="transform-input"
							size="small"
							without-steppers
							.value=${position[1].toFixed(2)}
							@input=${(e: Event) =>
								updateTransform([[position[0], numberValue(e)], scale, rotation])}
						>
							<span slot="start" class="prefix">Y</span>
							${renderKeyframeToggle('position.y')}
						</wa-number-input>
					</div>
				</div>
				${renderReset("position", () => updateTransform([[0, 0], scale, rotation]))}
			</div>

			<div class="control-row">
				<label>Scale</label>
				<div class="inputs">
					<div class="input-group">
						<wa-number-input
							class="transform-input"
							size="small"
							without-steppers
							step="0.01"
							min="0"
							.value=${String(scale[0])}
							@input=${(e: Event) => updateScale(numberValue(e), 0)}
						>
							<span slot="start" class="prefix">X</span>
							${renderKeyframeToggle('scale.x')}
						</wa-number-input>
					</div>
					<button
						type="button"
						class="scale-link"
						aria-pressed=${preserveAspectRatio()}
						@click=${toggleAspectRatioLock}
						title=${preserveAspectRatio() ? "Unlink scale" : "Link scale"}
					>
						<wa-icon name=${preserveAspectRatio() ? "link" : "link-slash"}></wa-icon>
					</button>
					<div class="input-group">
						<wa-number-input
							class="transform-input"
							size="small"
							without-steppers
							step="0.01"
							min="0"
							.value=${String(scale[1])}
							@input=${(e: Event) => updateScale(numberValue(e), 1)}
						>
							<span slot="start" class="prefix">Y</span>
							${renderKeyframeToggle('scale.y')}
						</wa-number-input>
					</div>
				</div>
				${renderReset("scale", () => updateTransform([position, [1, 1], rotation]))}
			</div>

			<div class="control-row">
				<label>Rotation</label>
				<div class="inputs">
					<div class="input-group">
						<wa-number-input
							class="transform-input"
							size="small"
							without-steppers
							.value=${String(rotation)}
							@input=${(e: Event) =>
								updateTransform([position, scale, numberValue(e)])}
						>
							<span slot="start" class="prefix">${rotateSvg}</span>
							${renderKeyframeToggle('rotation')}
						</wa-number-input>
					</div>
				</div>
				${renderReset("rotation", () => updateTransform([position, scale, 0]))}
			</div>
		</div>
	`
})

