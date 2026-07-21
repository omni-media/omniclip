
import {html} from 'lit'
import {shadow, useCss} from '@e280/sly'
import {Item} from '@omnimedia/omnitool'
import {ms} from '@omnimedia/omnitool/x/units/ms.js'
import {resolveTransformAnimation} from '@omnimedia/omnitool/x/timeline/utils/anim.js'

import styleCss from './style.css.js'
import {controlsStyles} from '../styles.css.js'
import keyframesSvg from '../../../../../../../../icons/keyframes.svg.js'
import {EditorContext} from '../../../../../../../../../context/context.js'
import {
	ANIMATION_CHANNELS,
	clamp,
	getAnimationRows,
	getKeyframeNav,
	setAnimationKeyframe,
	type AnimatableProperty,
	type SpatialLike
} from './utils.js'

import '@awesome.me/webawesome/dist/components/details/details.js'
import '@awesome.me/webawesome/dist/components/button/button.js'

export const KeyframesControls = shadow((context: EditorContext, item: Item.Text | Item.Video | Item.Image) => {
	useCss(controlsStyles, styleCss)

	const index = context.session.index
	const spatial = index.getItemMaybe<SpatialLike>(item.spatialId)
	const animationItem = (item.animationIds ?? [])
		.map(id => index.getItemMaybe<Item.Animation>(id))
		.find(animation => animation?.anims.transform)

	if (!spatial?.enabled) return html`
		<wa-details summary="KEYFRAMES" icon-placement="start" class="animations-panel">
			<div class="keyframes-hint">Enable transform to animate object properties.</div>
		</wa-details>
	`

	const laneStart = index.getItemLaneStart(item.id, context.session.$viewedItemId.value)
	const localTime = clamp(context.session.$playhead.value - laneStart, 0, item.duration)
	const animation = animationItem?.anims.transform

	const transform = animation
		? resolveTransformAnimation(localTime, animation)
		: spatial.transform

	const progress = Math.round(localTime / item.duration * 100)
	const rows = getAnimationRows(animation, localTime)
	const {previousTime, nextTime, animatedCount} = getKeyframeNav(rows, localTime)

	const setKeyframes = (
		properties: readonly AnimatableProperty[],
		enabled = true
	) => {
		context.session.updateTransformAnimation(item, transform, draft => {
			for (const property of properties)
				setAnimationKeyframe(draft, property, transform, localTime, enabled)
		})
	}

	const toggleKeyframe = (property: AnimatableProperty, active: boolean) => setKeyframes([property], !active)
	const addAllKeyframes = () => setKeyframes(ANIMATION_CHANNELS.map(({path}) => path))

	const seekTo = (target: number | undefined) => {
		if (target == null) return
		const time = ms(laneStart + target)
		context.session.playback.seek(time)
		context.session.setPlayhead(time)
	}

	const keyframedPropertiesLabel = (count: number) =>
		count
			? `${count} keyframed propert${count === 1 ? 'y' : 'ies'}`
			: 'No keyframed properties'

	return html`
		<wa-details summary="KEYFRAMES" icon-placement="start" class="animations-panel">
			<div class="keyframes-summary">
				${keyframedPropertiesLabel(animatedCount)}
			</div>

			<div class="keyframe-list">
				${rows.map(({channel, label, keyframes, active}) => html`
					<button
						type="button"
						class="keyframe-property"
						?data-active=${active}
						@click=${() => toggleKeyframe(channel.path, active)}
						title=${active
							? `Remove ${label} keyframe at current playhead`
							: `Add ${label} keyframe at current playhead`}
					>
						<span class="property-icon">${keyframesSvg}</span>
						<span class="property-name">${label}</span>
						<span class="property-meta">${keyframes.length} keys</span>
						<span class="property-meta">${progress}%</span>
					</button>
				`)}
			</div>

			<div class="keyframe-actions">
				<wa-button
					size="small"
					variant="neutral"
					@click=${addAllKeyframes}
				>
					Add Keyframe
				</wa-button>

				<div class="nav-buttons">
					<wa-button
						size="small"
						variant="neutral"
						?disabled=${previousTime == null}
						@click=${() => seekTo(previousTime)}
					>
						◀
					</wa-button>

					<wa-button
						size="small"
						variant="neutral"
						?disabled=${nextTime == null}
						@click=${() => seekTo(nextTime)}
					>
						▶
					</wa-button>
				</div>
			</div>
		</wa-details>
	`
})

