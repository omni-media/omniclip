
import {shadow, useCss} from '@e280/sly'
import {html, TemplateResult} from 'lit'
import {Item} from '@omnimedia/omnitool'
import {TextStyleOptions} from 'pixi.js'

import styleCss from './style.css.js'
import {sectionStyles} from '../styles.css.js'
import {ItemControlTabs} from '../control-tabs.js'
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

	const addText = () => {
		const viewed = context.session.index.getItemMaybe<Item.Any>(context.session.$viewedItemId.value)
		const parent = viewed && "childrenIds" in viewed
			? viewed
			: viewed && context.session.index.getParent(viewed.id)

		if (!parent)
			return

		const text = tool.text("Text", {
			styles: {fill: "white", fontSize: 64},
		})

		tool.set<typeof parent>(parent.id, {
			childrenIds: [...parent.childrenIds, text.id],
		})

		context.strata.outliner.mutate(state => {
			state.items.push({itemId: text.id, starred: false, tagIds: [], roleIds: []})
		})

		context.session.$selectedItem.value = text.id
		void context.controllers.player.seek(context.session.$playhead.value)
	}

	if (!item) {
		return html`
			<div class="add-text-container">
				<button @click=${addText}>
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
