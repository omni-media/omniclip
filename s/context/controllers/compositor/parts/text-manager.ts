import {generate_id} from "@benev/slate"
import {FabricText} from "fabric/dist/index.mjs"

import {Compositor} from "../controller.js"
import {TimelineActions} from "../../timeline/actions.js"
import {Font, FontStyle, TextAlign, TextEffect, XTimeline} from "../../timeline/types.js"
import {find_place_for_new_effect} from "../../timeline/utils/find_place_for_new_effect.js"

export class TextManager extends Map<string, FabricText> {
	#clicked_effect: TextEffect | null = null

	constructor(private compositor: Compositor, private actions: TimelineActions) {super()}

	add_text_effect(timeline: XTimeline) {
		const effect: TextEffect = {
			id: generate_id(),
			kind: "text",
			start_at_position: 0,
			duration: 5000,
			start: 0,
			end: 5000,
			track: 0,
			size: 38,
			content: "example",
			style: "normal",
			font: "Lato",
			color: "#e66465",
			align: "center",
			rect: {
				position_on_canvas: {
					x: 100,
					y: 50,
				},
				width: 100,
				height: 20,
				rotation: 0,
			}
		}
		this.#add_text(effect)
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		this.actions.add_text_effect(effect)
	}

	#add_text(effect: TextEffect) {
		const {size, color, content} = effect
		const text = new FabricText(content, {fill: color, fontSize: size, objectCaching: false})
		this.set(effect.id, text)
	}

	add_text_to_canvas(effect: TextEffect) {
		const max_track = 4 // lower track means it should draw on top of higher tracks, although moveObjectTo z-index works in reverse
		const text = this.get(effect.id)!
		this.compositor.canvas.add(text)
		this.compositor.canvas.moveObjectTo(text, 10)
		this.compositor.canvas.renderAll()
	}

	remove_text_from_canvas(effect: TextEffect) {
		const text = this.get(effect.id)!
		this.compositor.canvas.remove(text)
		this.compositor.canvas.renderAll()
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
