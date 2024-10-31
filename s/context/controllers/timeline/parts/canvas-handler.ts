import {Actions} from "../../../actions.js"
import {AnyEffect, State} from "../../../types.js"
import {Compositor} from "../../compositor/controller.js"
import {get_effect_at_timestamp} from "../../video-export/utils/get_effect_at_timestamp.js"

export class CanvasHandler {
	/**
		* Sets or discards the active object on the canvas based on the selected effect.
		* @param selectedEffect - The effect to set as active or null to discard active.
		* @param compositor - The compositor responsible for the canvas.
		* @param state - The current state including timecode and effects.
	*/
	setOrDiscardActiveObjectOnCanvas(selectedEffect: AnyEffect | null, compositor: Compositor, state: State) {
		if (!selectedEffect) {
			// Discard any active object if no effect is selected
			compositor.canvas.discardActiveObject()
			return
		}

		const isEffectOnCanvas = get_effect_at_timestamp(selectedEffect, state.timecode)

		if (isEffectOnCanvas) {
			const object = compositor.canvas.getObjects().find((object: any) =>
				(object?.effect as AnyEffect)?.id === selectedEffect.id
			)

			if (object && object !== compositor.canvas.getActiveObject()) {
				compositor.canvas.setActiveObject(object)
			}
		} else {
			compositor.canvas.discardActiveObject()
		}
	}

	/**
		* Sets the selected effect on the canvas, updating the canvas state.
		* @param effect - The effect to select or null to clear selection.
		* @param compositor - The compositor managing the canvas.
		* @param state - The application state, including current timecode.
		* @param actions - Actions to manage the selected effect.
	*/
	setSelectedEffect(effect: AnyEffect | undefined, compositor: Compositor, state: State, actions: Actions) {
		if (!effect) {
			// Clear selection if no effect is provided
			compositor.canvas.discardActiveObject()
			actions.set_selected_effect(null)
		} else {
			// Set the effect as selected in actions and update canvas
			actions.set_selected_effect(effect)
			if (effect.kind === "text") {
				compositor.managers.textManager.set_clicked_effect(effect)
			}
			this.setOrDiscardActiveObjectOnCanvas(effect, compositor, state)
		}

		compositor.canvas.renderAll()
	}
}
