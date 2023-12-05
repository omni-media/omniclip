import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {shadow_view} from "../../../../context/slate.js"
import {Status} from "../../../../context/controllers/timeline/types.js"

export const MediaPlayer = shadow_view({styles}, use => () => {
	use.watch(() => use.context.state.timeline)
	const [videoCodec, setVideoCodec] = use.state("avc")
	const [rendererName, setRendererName] = use.state("2d")
	const [isVideoPlaying, setIsVideoPlaying] = use.state(false)
	const [isVideoMuted, setIsVideoMuted] = use.state(false)

	const {canvasElement, status, video} = use.init(() => {
		const video = document.createElement("video")
		video.src = `${new URL("./bbb_video_avc_frag.mp4", import.meta.url)}`
		video.innerHTML = `
			<source
				type="video/mp4"
				src="${new URL("./bbb_video_avc_frag.mp4", import.meta.url)}" 
			/>
		`
		video.addEventListener(
			"play",
			() => {
				changeButtonState("playpause")
			},
			false,
		)

		video.addEventListener(
			"pause",
			() => {
				changeButtonState("playpause")
			},
			false,
		)

		const canvasElement = document.createElement("canvas")
		const fetch = document.createElement("tr")
		fetch.innerHTML = `
			<th align="right">Fetch</th>
			<td id="fetch">Not started</td>
		`
		const demux = document.createElement("tr")
		demux.innerHTML = `
			<th align="right">Demux</th>
			<td id="demux">Not started</td>
		`
		const decode = document.createElement("tr")
		decode.innerHTML = `
			<th align="right">Decode</th>
			<td id="decode">Not started</td>
		`
		const render = document.createElement("tr")
		render.innerHTML = `
			<th align="right">Render</th>
			<td id="render">Not started</td>
		`
		const status = {
			fetch,
			demux,
			decode,
			render
		}
		return [{canvasElement, status, video}, () => {}]
	})

	const setStatus = (message: MessageEvent<any>) => {
		for (const key in message.data) {
			status[key as Status].innerText = message.data[key]
		}
	}

	const start = () => {
		const dataUri = `./bbb_video_avc_frag.mp4`
		const worker = new Worker(new URL("./worker.js", import.meta.url), {type: "module"})
		const canvas = canvasElement.transferControlToOffscreen()
		worker.addEventListener("message", setStatus)
		worker.postMessage({dataUri, rendererName, canvas}, [canvas])
	}

	const changeButtonState = (type: "playpause" | "mute") => {
		if (type === "playpause") {
			if (video.paused || video.ended) {
				setIsVideoPlaying(false)
			} else {
				setIsVideoPlaying(true)
			}
		} else if (type === "mute") {
			setIsVideoMuted(video.muted ? true : false)
		}
	}
	
	const play_or_pause = () => {
		if (video.paused || video.ended) {
			video.play()
		} else {
			video.pause()
		}
	}

	video.currentTime = use.context.state.timeline.timecode.seconds

	return html`
		<p>
			Renderer:
			<label for="renderer_2d">
				<input
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setRendererName(target.value)
				}} 
				id="renderer_2d" type="radio" name="renderer" value="2d" checked> 2D
			</label>
			<label for="renderer_webgl">
				<input
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setRendererName(target.value)
				}} 
			id="renderer_webgl" type="radio" name="renderer" value="webgl"> WebGL
			</label>
			<label for="renderer_webgl2">
				<input 
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setRendererName(target.value)
				}} 
			id="renderer_webgl2" type="radio" name="renderer" value="webgl2"> WebGL 2
			</label>
			<label for="renderer_webgpu">
				<input
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setRendererName(target.value)
				}} 
			id="renderer_webgpu" type="radio" name="renderer" value="webgpu"> WebGPU
			</label>
		</p>

		<p>
			Video Codec:
			<label for="video_codec_h264">
				<input 
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setVideoCodec(target.value)
			}} 
			id="video_codec_h264" type="radio" name="video_codec" value="avc" checked> H.264
			</label>
			<label for="video_codec_h265">
				<input
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setVideoCodec(target.value)
				}} 
			id="video_codec_h265" type="radio" name="video_codec" value="hevc"> H.265
			</label>
			<label for="video_codec_vp8">
				<input 
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setVideoCodec(target.value)
				}} 
			id="video_codec_vp8" type="radio" name="video_codec" value="vp8"> VP8
			</label>
			<label for="video_codec_vp9">
				<input
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setVideoCodec(target.value)
				}} 
			id="video_codec_vp9" type="radio" name="video_codec" value="vp9"> VP9
			</label>
			<label for="video_codec_av1">
				<input 
					@change=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement
					setVideoCodec(target.value)
				}} 
			id="video_codec_av1" type="radio" name="video_codec" value="av1"> AV1
			</label>
		</p>

		<p>
			<button @click=${start} id="start">Start</button>
		</p>

		<table cellspacing="8" id="status">
			${status.fetch}
			${status.demux}
			${status.decode}
			${status.render}
		</table>
		<figure>
			${video}
			<div id="video-controls" class="controls">
				<button @click=${play_or_pause} id="playpause" type="button" data-state="${isVideoPlaying ? 'pause' : 'play'}">Play/Pause</button>
				<button id="stop" type="button" data-state="stop">Stop</button>
				<button id="mute" type="button" data-state="${isVideoMuted ? 'unmute' : 'mute'}">Mute/Unmute</button>
				<button id="volinc" type="button" data-state="volup">Vol+</button>
				<button id="voldec" type="button" data-state="voldown">Vol-</button>
				<button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
			</div>
		</figure>
		${canvasElement}
		<div>${use.context.state.timeline.timecode}</div>
	`
})
