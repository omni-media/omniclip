import {shadow, useCss} from '@e280/sly'
import {html, TemplateResult} from 'lit'
import {Item} from '@omnimedia/omnitool'
import {TextStyleOptions} from 'pixi.js'

import styleCss from './style.css.js'
import {sectionStyles} from '../styles.css.js'
import {renderFontDetails} from './details/font.js'
import {renderFillDetails} from './details/fill.js'
import {TransformControls} from '../transform/view.js'
import {renderLayoutDetails} from './details/layout.js'
import {renderStrokeDetails} from './details/stroke.js'
import {CompositingControls} from '../compositing/view.js'
import themeCss from '../../../../../../../../../theme.css.js'
import {renderMultilineDetails} from './details/multiline.js'
import {renderDropShadowDetails} from './details/dropshadow.js'
import addSvg from '../../../../../../../../icons/gravity-ui/add.svg.js'
import {EditorContext} from '../../../../../../../../../context/context.js'
import {TEXT_STYLE_DEFAULTS, TEXT_STYLE_OPTIONS} from '../../../../edit/constants.js'

export type TextDetailsProps = {
	style: TextStyleOptions
	options: typeof TEXT_STYLE_OPTIONS
	update: (v: TextStyleOptions) => void
}

export const TextControls = shadow((context: EditorContext, item: Item.Text | null) => {
	useCss(themeCss, sectionStyles, styleCss)

	const tool = context.omni
	const options = TEXT_STYLE_OPTIONS
	const defaults = TEXT_STYLE_DEFAULTS

	if (!item) {
		return html`
			<div class="add-text-container">
				<button @click=${() => console.log('add text')}>
					${addSvg}
					<span>Add Text</span>
				</button>
			</div>
		`
	}

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

			<div>
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
				<h4 class="heading">Compositing</h4>
				${CompositingControls(context, item)}
			</div>
		`
	}

	const controls = renderOtherControls()
	const styleItem = tool.require<Item.TextStyle>(item.styleId)

	if(!styleItem) {
		const textControls = renderTextControls({style: defaults, options, update: () => {}})
		return html`
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
				<div>${controls}</div>
			</div>
		`
	}

	const style = styleItem.style

	const textControls = renderTextControls({
		style: {...defaults, ...(style ?? {})},
		options,
		update: (style) => tool.set<Item.TextStyle>(styleItem.id, {style: {...styleItem.style, ...style}})
	})

	return html`
		${textControls}
		${controls}
	`
})
