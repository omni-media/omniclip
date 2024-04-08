import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {Font, FontStyle, TextAlign, TextEffect} from "../../timeline/types.js"

export class TextManager {
	#clicked_effect: TextEffect | null = null

	constructor(private compositor: Compositor, private actions: TimelineActions) {}

	draw_text(source: TextEffect) {
		const {size, color, content} = source
		this.compositor.ctx!.fillStyle = color
		this.compositor.ctx!.font = `${source.style} ${size}px Lato`
		this.compositor.ctx!.textAlign = `${source.align}`
		if(source.rect.rotation) {
			this.compositor.ctx!.save()
			this.compositor.EffectManager.rotate_effect(source)
			this.compositor.ctx!.fillText(content, -source.rect.width + source.rect.width, source.rect.height / 2)
			this.compositor.ctx!.restore()
		} else {
			this.compositor.ctx!.fillText(content, source.rect.position_on_canvas.x + source.rect.width / 2, source.rect.position_on_canvas.y + source.rect.height)
		}
	}

	measure_text_width (content: string, size: number, font: Font, color: string) {
		this.compositor.ctx!.font = `${size}px ${font}`;
		this.compositor.ctx!.fillStyle = color;
		return this.compositor.ctx?.measureText(content).width!
	}

	measure_text_height(content: string) {
		return this.compositor.ctx?.measureText(content).actualBoundingBoxAscent! + this.compositor.ctx?.measureText(content).actualBoundingBoxDescent!
	}

	set_text_font(font: Font, update_compositor: () => void) {
		this.actions.set_text_font(font)
		this.#clicked_effect!.font = font
		update_compositor()
	}

	set_font_size(size: number, update_compositor: () => void) {
		this.actions.set_font_size(size)
		this.#clicked_effect!.size = size
		this.#update_text_rect()
		update_compositor()
	}

	set_font_style(style: FontStyle, update_compositor: () => void) {
		this.actions.set_font_style(style)
		this.#clicked_effect!.style = style
		update_compositor()
	}

	set_text_align(align: TextAlign, update_compositor: () => void) {
		this.actions.set_text_align(align)
		this.#clicked_effect!.align = align
		update_compositor()
	}

	set_text_color(color: string, update_compositor: () => void) {
		this.actions.set_text_color(color)
		update_compositor()
	}

	set_text_content(content: string, update_compositor: () => void) {
		this.actions.set_text_content(content)
		this.#clicked_effect!.content = content
		this.#update_text_rect()
		update_compositor()
	}

	set_clicked_effect(effect: TextEffect) {
		this.#clicked_effect = {...effect}
	}

	#update_text_rect() {
		const {content, size, font, color} = this.#clicked_effect!
		const width = this.measure_text_width(content, size, font, color)
		const height = this.measure_text_height(content)
		const rect = {
			...this.#clicked_effect!.rect,
			width,
			height
		}
		this.#clicked_effect!.rect = rect
		this.actions.set_text_rect(this.#clicked_effect!, {...rect})
	}
}
