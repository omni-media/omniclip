import {Op, html} from "@benev/slate"

import {styles} from "./styles.js"
import {TextEffect} from "../../context/types.js"
import {FontMetadata} from "../../context/global.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import {shadow_component} from "../../context/context.js"
import xMarkSvg from "../../icons/gravity-ui/x-mark.svg.js"
import {StateHandler} from "../../views/state-handler/view.js"
import arrowupSvg from "../../icons/gravity-ui/arrowup.svg.js"
import arrowdownSvg from "../../icons/gravity-ui/arrowdown.svg.js"
import {convert_ms_to_hms} from "../omni-timeline/views/time-ruler/utils/convert_ms_to_hms.js"

export const OmniText = shadow_component(use => {
	use.styles(styles)
	use.watch(() => use.context.state)
	const manager = use.context.controllers.compositor.managers.textManager
	const selectedText = use.context.state.effects.find(e => e.id === manager.selectedText?.id) as TextEffect | undefined

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
					value=${manager.selectedText?.fontSize ?? manager.textDefaultStyles.size}
					type="number"
					label="Size"
					size="small"
				>
				</sl-input>
				<sl-select @sl-change=${manager.set_text_font} value=${selectedText?.fontFamily ?? "Arial"} label="Family" size="small">
					${getBaseFonts(fonts).map(font => html`<sl-option value=${font.family.replace(/\s+/g, '-')}>${font.family}</sl-option>`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_font_style} value=${selectedText?.fontStyle ?? "normal"} label="Style" size="small">
					${manager.textDefaultStyles.style.map(style => html`<sl-option value=${style}>${style}</sl-option>`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_font_variant} value=${selectedText?.fontVariant ?? "normal"} label="Variant" size="small">
					${manager.textDefaultStyles.variant.map(variant => html`<sl-option value=${variant}>${variant}</sl-option>`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_font_weight} value=${selectedText?.fontWeight ?? "normal"} label="Weight" size="small">
					${manager.textDefaultStyles.weight.map(weight => html`<sl-option value=${weight}>${weight}</sl-option>`)}
				</sl-select>
			</div>
		`
	}

	const renderFillStyles = () => {
		return html`
			<div class="cnt">
				<div class=colors-cnt>
					<label for="color">Color</label>
					<div>
						${(selectedText?.fill ?? manager.textDefaultStyles.fill).map((fill, i) => html`
							<div class=flex>
								<sl-input @sl-change=${(e: Event) => manager.set_fill(e, i)} size="small" type="color" id="color" name="color" .value=${fill}></sl-input>
								${(selectedText?.fill ?? manager.textDefaultStyles.fill).length > 1
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
						<sl-button size="small" class="add-color-btn" @click=${manager.add_fill}>
							<sl-icon slot="prefix" name="plus-lg"></sl-icon>
							Add Color
						</sl-button>
					</div>
				</div>
				<div>
					<sl-select @sl-change=${manager.set_fill_gradient_type} value=${selectedText?.fillGradientType ?? "0"} label="Gradient Type" size="small">
						<sl-option value="0">linear vertical</sl-option>
						<sl-option value="1">linear horizontal</sl-option>
					</sl-select>
				</div>
				<div class=stops-cnt>
					<label>Fill Gradient Stops</label>
					<div>
						${(selectedText?.fillGradientStops ?? manager.textDefaultStyles.fillGradientStops).map((stop, i) => html`
							<div class=flex>
								<sl-input
									@sl-change=${(e: Event) => manager.set_fill_gradient_stop(e, i)}
									type="number" min="0" max="1" step="0.1" value=${stop ?? 0} size="small"
								>
								</sl-input>
								<sl-button @click=${() => manager.remove_fill_gradient_stop(i)} variant="default" size="small">
									<sl-icon name="x-lg" label="remove"></sl-icon>
								</sl-button>
							</div>
						`)}
						<sl-button size="small" class="add-stop-btn" @click=${manager.add_fill_gradient_stop}>
							<sl-icon slot="prefix" name="plus-lg"></sl-icon>
							Add Stop Point
						</sl-button>
					</div>
				</div>
			</div>
		`
	}

	const renderStrokeStyles = () => {
		return html`
			<div class="cnt">
				<sl-color-picker @sl-change=${manager.set_stroke_color} value=${selectedText?.stroke} label="Color" size="small">
					<label slot="label">Color</label>
				</sl-color-picker>
				<sl-input
					@sl-change=${manager.set_stroke_thickness}
					type="number" min="0" step="1" value=${selectedText?.strokeThickness ?? 0} label="Thickness" size="small"
				>
				</sl-input>
				<sl-select @sl-change=${manager.set_stroke_line_join} value=${selectedText?.lineJoin ?? manager.textDefaultStyles.lineJoin[0]} label="Line Join" size="small">
					${manager.textDefaultStyles.lineJoin.map(line => html`
						<sl-option value=${line}>${line}</sl-option>
					`)}
				</sl-select>
				<sl-input
					@sl-change=${manager.set_stroke_miter_limit}
					type="number" min="0" step="1" value=${selectedText?.miterLimit ?? "10"} label="Miter Limit" size="small"
				>
				</sl-input>
			</div>
		`
	}

	const renderLayoutStyles = () => {
		return html`
			<div class="cnt">
				<sl-input
					@sl-change=${manager.set_letter_spacing}
					size="small" type="number" step="1" value=${selectedText?.letterSpacing ?? "0"} label="Letter Spacing" size="small"
				>
				</sl-input>
				<sl-select
					@sl-change=${manager.set_text_baseline}
					value=${selectedText?.textBaseline ?? manager.textDefaultStyles.textBaseline[0]} label="Text Baseling" size="small"
				>
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
				<sl-checkbox @sl-change=${manager.toggle_drop_shadow} ?checked=${selectedText?.dropShadow ?? false}>Enable</sl-checkbox>
				<div class=pick-color>
					<label>Color:</label>
					<sl-color-picker @sl-change=${manager.set_drop_shadow_color} value=${selectedText?.dropShadowColor ?? "#f5a623ff"} label="Color" size="small">
					</sl-color-picker>
				</div>
				<sl-input
					@sl-change=${manager.set_drop_shadow_alpha}
					type="number" min="0" max="1" step="0.1" value=${selectedText?.dropShadowAlpha ?? "1"} label="Alpha" size="small"
				>
				</sl-input>
				<sl-input
					@sl-change=${manager.set_drop_shadow_angle}
					type="number" step="0.1" value=${selectedText?.dropShadowAngle ?? "0.5"} label="Angle" size="small"
				>
				</sl-input>
				<sl-input
					@sl-change=${manager.set_drop_shadow_blur}
					type="number" step="1" value=${selectedText?.dropShadowBlur ?? "0"} label="Blur" size="small"
				>
				</sl-input>
				<sl-input
					@sl-change=${manager.set_drop_shadow_distance}
					type="number" step="1" value=${selectedText?.dropShadowDistance ?? "5"} label="Distance" size="small"
				>
				</sl-input>
			</div>
		`
	}

	const renderMultilineStyles = () => {
		return html`
			<div class="cnt">
				<sl-checkbox @sl-change=${manager.set_word_wrap} ?checked=${selectedText?.wordWrap ?? false}>Enable</sl-checkbox>
				<sl-checkbox @sl-change=${manager.set_break_words} ?checked=${selectedText?.breakWords ?? false}>Break Words</sl-checkbox>
				<sl-select @sl-change=${manager.set_text_align} value=${selectedText?.align ?? manager.textDefaultStyles.align[0]} label="Align" size="small">
					${manager.textDefaultStyles.align.map(align => html`
						<sl-option value=${align}>${align}</sl-option>
				`)}
				</sl-select>
				<sl-select @sl-change=${manager.set_white_space} value=${selectedText?.whiteSpace ?? manager.textDefaultStyles.whiteSpace[0]} label="White Space" size="small">
					${manager.textDefaultStyles.whiteSpace.map(v => html`
						<sl-option value=${v}>${v}</sl-option>
				`)}
				</sl-select>
				<sl-input @sl-change=${manager.set_wrap_width} type="number" step="10" min="0" value=${selectedText?.wordWrapWidth ?? "100"} label="Wrap Width" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_line_height} type="number" step="1" min="0" value==${selectedText?.lineHeight ?? "0"} label="Line Height" size="small"></sl-input>
				<sl-input @sl-change=${manager.set_leading} type="number" step="1" min="0" value==${selectedText?.leading ?? "0"} label="Leading" size="small"></sl-input>
			</div>
		`
	}

	const textEffects = use.context.state.effects.filter(e => e.kind === "text") as TextEffect[]

	return StateHandler(Op.all(
		use.context.helpers.ffmpeg.is_loading.value,
		use.context.is_webcodecs_supported.value), () => html`
		<div class="examples">
			<sl-select
				@sl-change=${(e: Event) => {
					const id = (e.target as HTMLSelectElement).value
					const effect = use.context.state.effects.find(e => e.id === id)
					use.context.controllers.timeline.set_selected_effect(effect, use.context.state)
				}}
				placeholder="no text selected"
				value=${selectedText?.id}
				class="select-text" label="Select text" help-text="Select text to edit or add if none" size="small"
			>
				${textEffects.map(e => html`<sl-option value=${e.id}>${e.text} (${convert_ms_to_hms(e.start_at_position)})</sl-option>`)}
				<sl-button
					@click=${() => manager.create_and_add_text_effect(use.context.state)}
					class="add-text" variant="default" size="small"
				>
					<sl-icon slot="prefix" name="plus-lg"></sl-icon>
					Add Text
				</sl-button>
			</sl-select>
			<div class="styles" >
				<sl-textarea ?disabled=${!selectedText} @sl-input=${manager.set_text_content} size="small" value=${selectedText?.text ?? "Default text"}></sl-textarea>
				<sl-details ?disabled=${!selectedText} summary="Font">${renderFontStyles()}</sl-details>
				<sl-details ?disabled=${!selectedText} summary="Fill">${renderFillStyles()}</sl-details>
				<sl-details ?disabled=${!selectedText} summary="Stroke">${renderStrokeStyles()}</sl-details>
				<sl-details ?disabled=${!selectedText} summary="Layout">${renderLayoutStyles()}</sl-details>
				<sl-details ?disabled=${!selectedText} summary="Drop Shadow">${renderDropShadowStyles()}</sl-details>
				<sl-details ?disabled=${!selectedText} summary="Multiline">${renderMultilineStyles()}</sl-details>
			</div>
			<div class="example">
				<span>Default text</span>
				<div @click=${() => manager.create_and_add_text_effect(use.context.state)} class="add-btn">${addSvg}</div>
			</div>
		</div>
	`)
})
