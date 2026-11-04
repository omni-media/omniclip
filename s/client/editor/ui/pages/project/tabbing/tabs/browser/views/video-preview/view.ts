
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
	const pointerenter = () => video.play()

	const pointerleave = () => {
		video.pause()
		video.currentTime = 0
	}

	useMount(() => {
		let disposed = false
		video.muted = true
		video.loop = true
		video.playsInline = true
		video.preload = "metadata"
		video.setAttribute("aria-label", options.label)
		const detach = dom.events(video, {pointerenter, pointerleave})
		void options.library.cellar.load(options.hash).then(cask => {
			if (disposed) return
			video.src = URL.createObjectURL(new Blob([cask.file], {type: options.mime}))
		}).catch(error => console.error("Could not load media preview", error))

		return () => {
			disposed = true
			detach()
			if (video.src) URL.revokeObjectURL(video.src)
			video.removeAttribute("src")
		}
	})

	return html`${video}`
})

