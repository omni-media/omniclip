import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {FontMetadata} from "../../context/global.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/context.js"
import xMarkSvg from "../../icons/gravity-ui/x-mark.svg.js"
import {StateHandler} from "../../views/state-handler/view.js"
import arrowupSvg from "../../icons/gravity-ui/arrowup.svg.js"
import arrowdownSvg from "../../icons/gravity-ui/arrowdown.svg.js"

export const OmniText = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const manager = use.context.controllers.compositor.managers.textManager

	const [fonts, setFonts] = use.state<FontMetadata[]>([])
	const [fontsDenied, setFontsDenied] = use.state<null | string>(null) // when user granted permission or not

	use.once(async () => {
		try {
			const fonts = await manager.getFonts((status, deniedStateText, fonts) => {
				// listener for changes in permission
				if(status === "denied") {
					setFontsDenied(deniedStateText)
					setFonts([])
				} else if (status === "granted") {
					setFontsDenied(null)
					setFonts(fonts!)
				}
			})
			setFonts(fonts)
		} catch (e) {
			const event = e as string
			setFontsDenied(event)
		}
	})

	function getBaseFonts(fonts: FontMetadata[]): FontMetadata[] {
		return fonts.filter(font => font.fullName === font.family)
	}

	use.mount(() => () => manager.destroy())

	const renderFontStyles = () => {
		return html`
			<div class="cnt">
				<h3>Font</h3>
				<sl-input
					@sl-input=${manager.set_font_size}
					min="1"
					max="9999"
					type="number"
					.value=${manager.textDefaultStyles.size}
					type="number"
					label="Size"
					size="small"
				>
				</sl-input>
				<sl-select @sl-change=${manager.set_text_font} value="Arial" label="Family" size="small">
					${getBaseFonts(fonts).map(font => html`<sl-option value=${font.family.replace(/\s+/g, '-')}>${font.family}</sl-option>`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_font_style} value="normal" label="Style" size="small">
					${manager.textDefaultStyles.style.map(style => html`<sl-option value=${style}>${style}</sl-option>`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_font_variant} value="normal" label="Variant" size="small">
					${manager.textDefaultStyles.variant.map(variant => html`<sl-option value=${variant}>${variant}</sl-option>`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_font_weight} value="normal" label="Weight" size="small">
					${manager.textDefaultStyles.weight.map(weight => html`<sl-option value=${weight}>${weight}</sl-option>`)}
				</sl-select>
			</div>
		`
	}

	const renderFillStyles = () => {
		return html`
			<div class=color-cnt>
				<label for="color">Color</label>
				<div>
					${manager.textDefaultStyles.fill.map((fill, i) => html`
						<div class=flex>
							<sl-input @sl-change=${(e: Event) => manager.set_fill(e, i)} type="color" id="color" name="color" .value=${fill}></sl-input>
							${manager.textDefaultStyles.fill.length > 1
								? html`
									${i === 0
										? html`<button @click=${() => manager.move_fill_down(i)}>${arrowdownSvg}</button>`
										: i === manager.textDefaultStyles.fill.length - 1
											? html`<button @click=${() => manager.move_fill_up(i)}>${arrowupSvg}</button>`
											: html`
												<button @click=${() => manager.move_fill_down(i)}>${arrowdownSvg}</button>
												<button @click=${() => manager.move_fill_up(i)}>${arrowupSvg}</button>
									`}
									<button @click=${() => manager.remove_fill(i)}>${xMarkSvg}</button>
									`
								: null
							}
						</div>
					`)}
					<button @click=${manager.add_fill}>${addSvg} Add Color</button>
				</div>
			</div>
			<div>
				<sl-select @sl-change=${manager.set_fill_gradient_type} value="linear vertical" label="Gradient Type" size="small">
					<sl-option value="0">linear vertical</sl-option>
					<sl-option value="1">linear horizontal</sl-option>
				</sl-select>
			</div>
			<div class=color-cnt>
				<label>Fill Gradient Stops</label>
				<div>
					${manager.textDefaultStyles.fillGradientStops.map((stop, i) => html`
						<div class=flex>
							<sl-input
								@sl-change=${(e: Event) => manager.set_fill_gradient_stop(e, i)}
								label="stop" type="number" min="0" max="1" step="0.1" value="0" size="small"
							>
							</sl-input>
							<sl-button @click=${() => manager.remove_fill_gradient_stop(i)} size="small">${xMarkSvg}</sl-button>
						</div>
					`)}
					<button @click=${manager.add_fill_gradient_stop}>${addSvg} Add Stop Point</button>
				</div>
			</div>
		`
	}

	const renderStrokeStyles = () => {
		return html`
			<div class="cnt">
				<sl-input @sl-change=${manager.set_stroke_color} type="color" label="Color" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_stroke_thickness} type="number" min="0" step="1" value="0" label="Thickness" size="small"></sl-input>
				<sl-select @sl-change=${manager.set_stroke_line_join} value=${manager.textDefaultStyles.lineJoin[0]} label="Line Join" size="small">
					${manager.textDefaultStyles.lineJoin.map(line => html`
						<sl-option value=${line}>${line}</sl-option>
					`)}
				</sl-select>
				<sl-input @sl-change=${manager.set_stroke_miter_limit} type="number" min="0" step="1" value="10" label="Miter Limit" size="small"></sl-input>
			</div>
		`
	}

	const renderLayoutStyles = () => {
		return html`
			<div class="cnt">
				<sl-input @sl-change=${manager.set_letter_spacing} size="small" type="number" step="1" value="0" label="Letter Spacing" size="small"></sl-input>
				<sl-select @sl-change=${manager.set_text_baseline} value=${manager.textDefaultStyles.textBaseline[0]} label="Text Baseling" size="small">
					${manager.textDefaultStyles.textBaseline.map(b => html`
						<sl-option value=${b}>${b}</sl-option>
					`)}
				</sl-select>
			</div>
		`
	}

	const renderDropShadowStyles = () => {
		return html`
			<div class="cnt">
				<sl-checkbox @sl-change=${manager.toggle_drop_shadow}>Enable</sl-checkbox>
				<div class=pick-color>
					<label>Color:</label>
					<sl-color-picker @sl-change=${manager.set_drop_shadow_color} value="#f5a623ff" label="Color" size="small">
					</sl-color-picker>
				</div>
				<sl-input @sl-change=${manager.set_drop_shadow_alpha} type="number" min="0" max="1" step="0.1" value="1" label="Alpha" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_drop_shadow_angle} type="number" step="0.1" value="0.5" label="Angle" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_drop_shadow_blur} type="number" step="1" value="0" label="Blur" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_drop_shadow_distance} type="number" step="1" value="5" label="Distance" size="small"></sl-input>
			</div>
		`
	}

	const renderMultilineStyles = () => {
		return html`
			<div class="cnt">
				<sl-checkbox @sl-change=${manager.set_word_wrap}>Enable</sl-checkbox>
				<sl-checkbox @sl-change=${manager.set_break_words}>Break Words</sl-checkbox>
				<sl-select @sl-change=${manager.set_text_align} value=${manager.textDefaultStyles.align[0]} label="Align" size="small">
					${manager.textDefaultStyles.align.map(align => html`
						<sl-option value=${align}>${align}</sl-option>
				`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_white_space} value=${manager.textDefaultStyles.whiteSpace[0]} label="White Space" size="small">
					${manager.textDefaultStyles.whiteSpace.map(v => html`
						<sl-option value=${v}>${v}</sl-option>
				`)}
				</sl-select>
				<sl-input @sl-change=${manager.set_wrap_width} type="number" step="10" min="0" value="100" label="Wrap Width" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_line_height} type="number" step="1" min="0" value="0" label="Line Height" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_leading} type="number" step="1" min="0" value="0" label="Leading" size="small"></sl-input>
			</div>
		`
	}

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="examples">
			<sl-textarea size="small" value="Default text"></sl-textarea>
			<div class=styles>
				<sl-details summary="Font">${renderFontStyles()}</sl-details>
				<sl-details summary="Fill">${renderFillStyles()}</sl-details>
				<sl-details summary="Stroke">${renderStrokeStyles()}</sl-details>
				<sl-details summary="Layout">${renderLayoutStyles()}</sl-details>
				<sl-details summary="Drop Shadow">${renderDropShadowStyles()}</sl-details>
				<sl-details summary="Multiline">${renderMultilineStyles()}</sl-details>
			</div>
			<div class="example">
				<span>example</span>
				<div @click=${() => manager.create_and_add_text_effect(use.context.state)} class="add-btn">${addSvg}</div>
			</div>
		</div>
	`)
})
