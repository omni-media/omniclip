import {
	TextStyle, TextStyleAlign, TextStyleOptions, TextStyleFontVariant, TextStyleFontStyle, TextStyleFontWeight,
	TextStyleTextBaseline, TextDropShadow, Filter, TextStyleWhiteSpace, StrokeStyle, FillStyle
} from "pixi.js"

export const PIXELS_PER_MILLISECOND = 0.1
export const PIXELS_PER_SECOND = 1

export const TEXT_STYLE_OPTIONS = {
	align: ['left', 'center', 'right', 'justify'] satisfies TextStyleAlign[],
	breakWords: false,
	dropShadow: true satisfies boolean | Partial<TextDropShadow>,
	fill: {} satisfies FillStyle,
	filters: [] satisfies Filter[],
	fontFamily: "Arial" satisfies string | string[],
	fontSize: "32" satisfies string | number,
	fontStyle: ['normal', 'italic', 'oblique'] satisfies TextStyleFontStyle[],
	fontVariant: ['normal', 'small-caps'] satisfies TextStyleFontVariant[],
	fontWeight: ['normal', 'bold', 'bolder', 'lighter', "100", "200", "300", "400", "500", "600", "700", "800", "900"] satisfies TextStyleFontWeight[],
	leading: 0,
	letterSpacing: 5,
	lineHeight: 5,
	padding: 5,
	stroke: {} satisfies StrokeStyle,
	textBaseline: ['alphabetic', 'top', 'middle', 'bottom', 'ideographic', 'hanging'] satisfies TextStyleTextBaseline[],
	trim: false,
	whiteSpace: ['normal', 'pre', 'pre-line'] satisfies TextStyleWhiteSpace[],
	wordWrap: false,
	wordWrapWidth: 5
}

export const TEXT_STYLE_DEFAULTS: Required<TextStyleOptions> = TextStyle.defaultTextStyle as Required<TextStyleOptions>
