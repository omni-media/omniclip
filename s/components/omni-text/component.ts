import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {Text} from "../../types.js"
import {shadow_component} from "../../context/slate.js"
import {Html} from "@benev/turtle";
import {TemplateResult} from "lit";

export const OmniText = shadow_component({styles}, use => {
    const [text_list, set_text_list] = use.state<Text[]>([])
    const [active_text, set_active_text] = use.state<Number | null>(null)
    const base_text: Text = {
        content: "Text",
        size: 12,
        color: "#000000",
        position_x: 0,
        position_y: 0
    }


    let add_text = function (e: Event): void {
        set_text_list(
            [...text_list, base_text]
        )
        set_active_text(text_list.length - 1)
    }

    let render_editor = function () : TemplateResult {
        if(!active_text){
            return html``
        }
        return html`
            <div>
                
            </div>
        `
    }


    let texts_html = text_list.map((text: Text, index: Number) => {
        let style_string: String = `color:"${text.color}"; font-size:"${text.size}"`
        return html`
            <input type="text"
                   style="${style_string}"
                   value="${text.content}"
                   @click="${set_active_text(index)}"/>
        `
    })
    return html`
        <div>
            <button @click="${add_text}" style="color:white;">Add text</button>
                "${texts_html}"
        </div>
    `
})

