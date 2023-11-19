import {html} from "@benev/slate"
import {FFmpeg} from "@ffmpeg/ffmpeg/dist/esm/index.js"
import {FileData} from "@ffmpeg/ffmpeg/dist/esm/types"
import {fetchFile, toBlobURL} from "@ffmpeg/util/dist/esm/index.js"

import {Text} from "./types.js"
import {styles} from "./styles.js"
import {shadow_component} from "../../context/slate.js"
import {TextManager} from "./views/text-manager/view.js";

export const OmniText = shadow_component({styles}, use => {
	const [text_list, set_text_list] = use.state<Text[]>([])
	const [video, set_video] = use.state<File | null>(null)
	const ffmpeg = use.prepare(() => new FFmpeg())


	const load = async  () =>{
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm'
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
		})
	}

	const transcode = async () =>{
		await load()
		try{
			await ffmpeg.exec(['-t', '10', '-f' ,'lavfi', '-i', 'color=c=black:s=640x480', 'libx264', 'output.mp4'])
			const data : FileData = await ffmpeg.readFile('output.mp4')
			// console.log(URL.createObjectURL(new Blob([Buffer.from(data)], {type: 'video/mp4'})))
		}
		catch (err){
			console.log(err)
		}
	}


	return html`
		<div>
			<button @click="${load}">Load core</button><br/>
			<button @click="${transcode}" style="color:white;" >Generate blank video url</button><br/>
			${TextManager([text_list,set_text_list])}
		</div>
	`
})

