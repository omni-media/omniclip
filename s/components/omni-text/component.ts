import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {Text} from "../../types.js"
import {shadow_component} from "../../context/slate.js"
import {TemplateResult} from "lit";
import {slate} from "@benev/construct/x/mini.js";

export const OmniText = shadow_component({styles}, use => {
    const [text_list, set_text_list] = use.state<Text[]>([])
    const [active_text, set_active_text] = use.state<number>(0)
    const [is_active, set_is_active] = use.state<Boolean>(false)
    const base_text: Text = {
        content: "Text",
        size: 12,
        color: "#FFFFFF",
        position_x: 0,
        position_y: 0
    }


    let add_text = function (e: Event): void {
        set_text_list(
            [...text_list, base_text]
        )
        set_active_text(text_list.length - 1)
    }


    let render_editor = function (): TemplateResult {
        if (!is_active) {
            return html``
        }
        return html`
            <div>
                    ${TextEditor([{...text_list[active_text]}, update_active_text])}
            </div>
        `
    }

    let update_active_text = function (text: Text): void {
        let new_text_list = [...text_list]
        new_text_list[active_text] = text
        set_text_list(new_text_list)
    }

    let on_text_input = (e :Event) =>{
        let new_text : Text = {...text_list[active_text]}
        let target = e.currentTarget as HTMLFormElement
        new_text['content'] = target.value as string
        update_active_text((new_text))
    }

    let texts_html = text_list.map((text: Text, index: number) => {
        let style_string: String = `color:${text.color}; font-size:${text.size}px;width:${text.content.length}ch;`
        return html`
            <input type="text"
                   class="text-input"
                   style="${style_string}"
                   value="${text.content}"
                   @click=${() => {
                       set_active_text(index);
                       set_is_active(true);
                   }}
                   @input=${on_text_input}
            />
        `
    })
    return html`
        <div>
            <button @click="${add_text}" style="color:white;">Add text</button>
                ${texts_html}
                ${render_editor()}
        </div>
    `
})

const TextEditor = slate.shadow_view({styles}, use => (text: Text, onChange: Function) => {

    let on_color_change = (e: Event) => {
        let target = e.currentTarget as HTMLFormElement
        text['color'] = target.value as string
        onChange(text)
    }
    let on_size_change = (e: Event) => {
        let target = e.currentTarget as HTMLFormElement
        text['size'] = target.value as number
        onChange(text)
    }

    return html`
        <div class="text-editor">
            Color:
            <input @change="${on_color_change}" type="color" value="${text.color}">
            Size
            <input @change="${on_size_change}" type="number" value="${text.size}">
        </div>
    `
})


