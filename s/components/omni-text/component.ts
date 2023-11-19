import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {Text} from "../../types.js"
import {shadow_component} from "../../context/slate.js"
import {TemplateResult} from "lit";
import {slate} from "@benev/construct/x/mini.js";
import {FFmpeg} from "@ffmpeg/ffmpeg/dist/esm/index.js"
import {fetchFile, toBlobURL} from '@ffmpeg/util/dist/esm/index.js';
import {FileData} from "@ffmpeg/ffmpeg/dist/esm/types";
import * as buffer from "buffer";

export const OmniText = shadow_component({styles}, use => {
    const [text_list, set_text_list] = use.state<Text[]>([])
    const [active_text, set_active_text] = use.state<number>(0)
    const [is_active, set_is_active] = use.state<Boolean>(false)
    const [ffmpeg,set_ffmpeg] = use.state<FFmpeg>(new FFmpeg())
    const [video,set_video] = use.state<File | null>(null)
    const base_text: Text = {
        content: "Text",
        size: 12,
        color: "#FFFFFF",
        position_x: 0,
        position_y: 0
    }

    const transcode = async () =>{
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        await ffmpeg.exec(['-t', '10', '-f' ,'lavfi', '-i', 'color=c=black:s=640x480',
            'libx264', 'output.mp4'])
        const data : FileData = await ffmpeg.readFile('output.mp4')
        console.log(URL.createObjectURL(new Blob([Buffer.from(data)], {type: 'video/mp4'})))
    }

    let add_text = (e: Event): void => {
        set_text_list(
            [...text_list, base_text]
        )
        set_active_text(text_list.length - 1)
        //notify global context
    }


    let render_editor = (): TemplateResult => {
        if (!is_active) {
            return html``
        }
        return html`
            <div>
                ${TextEditor([{...text_list[active_text]}, update_active_text])}
            </div>
        `
    }

    let update_active_text = (text: Text): void => {
        set_text_list(text_list.map(
            (el,key) => key === active_text ? text : el
        ))
        //notify global context
    }

    let on_text_input = (e: Event) => {
        let target = e.currentTarget as HTMLFormElement
        update_active_text({...text_list[active_text],content:target.value as string})
    }


    let texts_html = text_list.map((text: Text, index: number) => {
        let style_string: String = `color:${text.color};
                                    font-size:${text.size}px;
                                    width:${text.content.length}ch;
                                    left:${text.position_x}px;
                                    bottom:${text.position_y}px;`
        return html`
            <input type="text"
                   class="text-input"
                   style="${style_string}"
                   value="${text.content}"
                   @click=${() => {
                       set_active_text(index);
                       set_is_active(true);
                   }}
                   @mousedown=""
                   @input=${on_text_input}
            />
        `
    })
    return html`
        <div>
            Test:
            <button @click="${transcode}" style="color:white;" >Generate blank video url</button><br/>
            <button @click="${add_text}" style="color:white;">Add text</button>
            <div class="video-canvas">
                ${texts_html}
            </div>
            ${render_editor()}
            
        </div>
    `
})

const TextEditor = slate.shadow_view({styles}, use => (text: Text, onChange: Function) => {

    let on_property_change = <Key extends keyof Text>(e: Event, attribute: Key) => {
        let target = e.currentTarget as HTMLFormElement
        let old_value = text[attribute]
        let new_text : Text = {...text}
        new_text[attribute] = target.value as typeof old_value
        onChange(new_text)
    }

    return html`
        <div class="text-editor">
            Color:
            <input @input="${(e:Event)=>on_property_change(e,'color')}" type="color" .value=${text.color}>
            Size
            <input @input="${(e:Event)=>on_property_change(e,'size')}" type="number" .value=${text.size}>
            X-pos
            <input @input="${(e: Event) => on_property_change(e, "position_x")}" type="number"
                   .value=${text.position_x}>
            Y-pos
            <input @input="${(e: Event) => on_property_change(e, "position_y")}" type="number"
                   .value=${text.position_y}>
        </div>
    `
})


