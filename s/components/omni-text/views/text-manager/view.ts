import {html} from "@benev/slate"
import {shadow_view} from "../../../../context/slate.js"

import {Text} from "../../types.js"
import {styles} from "./styles.js"
import {TextEditor} from "../text-editor/view.js"



export const TextManager = shadow_view({styles}, use => (
    text_list : Text[],
    set_text_list : (text_list:Text[]) => void
) => {

    const [active_text, set_active_text] = use.state<number>(0)
    const [is_active, set_is_active] = use.state<Boolean>(false)
    const base_text: Text = {
        content: "Text",
        size: 12,
        color: "#FFFFFF",
        position_x: 0,
        position_y: 0
    }

    let add_text = (e: Event): void => {
        set_text_list(
            [...text_list, base_text]
        )
        set_active_text(text_list.length - 1)
        //notify global context
    }

    let update_active_text = (text: Text): void => {
        set_text_list(text_list.map((el, key) => key === active_text
            ? text
            : el
        ))
        //notify global context
    }

    let on_text_input = (e: Event) => {
        let target = e.currentTarget as HTMLFormElement
        update_active_text({...text_list[active_text], content: target.value as string})
    }

    let texts_html = text_list.map((text: Text, index: number) => {
        let style_string: String = `
			color:${text.color};
			font-size:${text.size}px;
			width:${text.content.length}ch;
			left:${text.position_x}px;
			bottom:${text.position_y}px;
		`
        return html`
            <input type="text"
                   class="text-input"
                   style="${style_string}"
                   value="${text.content}"
                   @click=${() => {
                       set_active_text(index)
                       set_is_active(true)
                   }}
                   @mousedown=""
                   @input=${on_text_input}
            />
        `
    })

    return html`
        <div>
            <button @click="${add_text}" style="color:white;">Add text</button>
            <div class="video-canvas">
                ${texts_html}
            </div>
            ${is_active
                    ? TextEditor([{...text_list[active_text]}, update_active_text])
                    : null
            }
        </div>
    `
})

