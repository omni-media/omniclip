
import {shadow, useCss} from '@e280/sly'
import {html, TemplateResult} from 'lit'
import {Item} from '@omnimedia/omnitool'
import {TextStyleOptions} from 'pixi.js'

import styleCss from './style.css.js'
import {RoleControls} from '../role.js'
import {controlsStyles} from '../styles.css.js'
import {FiltersControls} from '../filters/view.js'
import {renderFontDetails} from './details/font.js'
import {renderFillDetails} from './details/fill.js'
import {TransformControls} from '../transform/view.js'
import {KeyframesControls} from '../keyframes/view.js'
import {renderLayoutDetails} from './details/layout.js'
import {renderStrokeDetails} from './details/stroke.js'
import {AnimationsControls} from '../animations/view.js'
import {CompositingControls} from '../compositing/view.js'
import themeCss from '../../../../../../../../../theme.css.js'
import {renderMultilineDetails} from './details/multiline.js'
import {renderDropShadowDetails} from './details/dropshadow.js'
import {ItemControlTabs, itemControlTabsCss} from '../control-tabs.js'
import addSvg from '../../../../../../../../icons/gravity-ui/add.svg.js'
import {EditorContext} from '../../../../../../../../../context/context.js'
import {TEXT_STYLE_DEFAULTS, TEXT_STYLE_OPTIONS} from '../../../../edit/constants.js'

import '@awesome.me/webawesome/dist/components/details/details.js'

export type TextDetailsProps = {
	style: TextStyleOptions
	options: typeof TEXT_STYLE_OPTIONS
	update: (v: TextStyleOptions) => void
}

export const TextControls = shadow((context: EditorContext, item: Item.Text) => {
	useCss(themeCss, controlsStyles, itemControlTabsCss, styleCss)

	const tool = context.omni
	const options = TEXT_STYLE_OPTIONS
	const defaults = TEXT_STYLE_DEFAULTS

	const renderTextControls = (props: TextDetailsProps): TemplateResult => {
		return html`
			<div class="controls-group">
				<label for="content-input">Content</label>
				<textarea
					id="content-input"
					class="text-input"
					.value=${item.content}
					@input=${(e: any) => tool.set<Item.Text>(item.id, {content: e.target.value})}
				></textarea>
			</div>

			<div class="text-style-controls">
				${renderFontDetails(props)}
				${renderFillDetails(props)}
				${renderMultilineDetails(props)}
				${renderDropShadowDetails(props)}
				${renderLayoutDetails(props)}
				${renderStrokeDetails(props)}
			</div>
		`
	}

	const renderOtherControls = () => {
		return html`
			<div class="controls-group">
				<h4 class="heading">Transform</h4>
				${TransformControls(context, item)}
			</div>

			<div class="controls-group">
				${KeyframesControls(context, item)}
			</div>

			<div class="controls-group">
				<h4 class="heading">Compositing</h4>
				${CompositingControls(context, item)}
			</div>
		`
	}

	const otherControls = renderOtherControls()
	const styleItem = tool.require<Item.TextStyle>(item.styleId)

	if(!styleItem) {
		const textControls = renderTextControls({style: defaults, options, update: () => {}})
		return html`
			${ItemControlTabs({
				properties: html`
					${RoleControls(context, item)}
					<div>
						<button
							@click=${() => {
								const style = tool.textStyle({})
								tool.set<Item.Text>(item.id, {styleId: style.id})
							}}
							class=create-styles
						>
							create styles ${addSvg}
						</button>
						<div class=disabled>${textControls}</div>
						<div>${otherControls}</div>
					</div>
				`,
				effects: html`
					${FiltersControls(context, item)}
					${AnimationsControls(context, item)}
				`,
			})}
		`
	}

	const style = styleItem.style

	const textControls = renderTextControls({
		style: {...defaults, ...(style ?? {})},
		options,
		update: (style) => tool.set<Item.TextStyle>(styleItem.id, {style: {...styleItem.style, ...style}})
	})

	return html`
		${ItemControlTabs({
			properties: html`
				${RoleControls(context, item)}
				${textControls}
				${otherControls}
			`,
			effects: html`
				${FiltersControls(context, item)}
				${AnimationsControls(context, item)}
			`,
		})}
	`
})
