
import {html} from "lit"
import {MediaLibrary} from "@e280/quay"
import {dom, shadow, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"

type VideoPreviewOptions = {
	library: MediaLibrary
	hash: string
	mime: string
	label: string
}

export const VideoPreview = shadow((options: VideoPreviewOptions) => {
	useCss(styleCss)

	const video = useOnce(() => document.createElement("video"))
	let load: Promise<void> | undefined

	const loadVideo = () => {
		if (load)
			return load

		load = (async() => {
			const cask = await options.library.cellar.load(options.hash)
			const file = new Blob([cask.file], {type: options.mime})
			video.src = URL.createObjectURL(file)
		})()

		return load
	}

	const pointerenter = () => video.play()

	const pointerleave = () => {
		video.pause()
		video.currentTime = 0
	}

	useMount(() => {
		video.muted = true
		video.loop = true
		video.playsInline = true
		video.preload = "metadata"
		video.setAttribute("aria-label", options.label)
		const detach = dom.events(video, {pointerenter, pointerleave})
		loadVideo()

		return () => {
			detach()
			if (video.src)
				URL.revokeObjectURL(video.src)
		}
	})

	return html`${video}`
})

