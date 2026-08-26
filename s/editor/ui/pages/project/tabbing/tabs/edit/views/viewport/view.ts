
import {html} from "lit"
import {shadow, useCss, useMount, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {Toolbar} from "../toolbar/view.js"
import themeCss from "../../../../../../../../theme.css.js"
import {titleFromId} from "../../../../../../projects/constants.js"
import {EditorContext} from "../../../../../../../../context/context.js"
import fullscreenSvg from "../../../../../../../icons/gravity-ui/fullscreen.svg.js"
import {getResolutionLabel} from "../../../../../../../logic/modals/settings/utils.js"

import "@awesome.me/webawesome/dist/components/slider/slider.js"
import "@awesome.me/webawesome/dist/components/button/button.js"
import "@awesome.me/webawesome/dist/components/dropdown/dropdown.js"
import "@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item.js"

export const TimelineViewport = shadow((context: EditorContext) => {
	useCss(themeCss, styleCss)

	const maxViewerZoom = 2
	const minViewerZoom = 0.25
	const player = context.controllers.player
	const canvas = player.canvas
	const viewerZoom = useSignal(1)
	const settings = context.strata.settings.state
	const title = titleFromId(context.strata.projectId)
	const viewerZoomPercent = Math.round(viewerZoom() * 100)
	const resolution = getResolutionLabel(settings.aspectRatio, settings.resolution)

	const setViewerZoom = (value: number) => {
		const zoom = Math.max(minViewerZoom, Math.min(maxViewerZoom, value))
		viewerZoom(zoom)
		context.session.stage.setViewerZoom(zoom)
	}

	const selectViewerZoom = (event: Event) => {
		const target = event.target as HTMLInputElement
		setViewerZoom(+target.value)
	}

	const fullscreen = (event: Event) => {
		const target = event.currentTarget as HTMLElement
		const viewport = target.closest(".viewport")
		viewport?.requestFullscreen()
	}

	const selectZoomPreset = (event: CustomEvent) => {
		const item = event.detail.item
		if (item.value === "fit")
			setViewerZoom(1)
		else
			setViewerZoom(+item.value)
	}

	useMount(() => {
		const resize = (resolution: string) => {
			const [width, height] = resolution.split("x").map(Number)
			context.session.stage.resize(width, height)
			canvas.style.aspectRatio = `${width}/${height}`
		}

		resize(settings.resolution)
		const dispose = context.strata.settings
			.on(s => resize(s.resolution))
		return () => dispose()
	})

	return html`
		<div class=viewport>
			<header class=viewer-header>
				<div class=viewer-header-left>
					<wa-dropdown
						class=viewer-zoom-dropdown
						placement="bottom-start"
						distance="8"
						skidding="-6"
						@wa-select=${selectZoomPreset}
					>
						<wa-button
							slot="trigger"
							class=viewer-zoom-trigger
							size="small"
							variant="neutral"
							appearance="filled-outlined"
							with-caret
						>
							${viewerZoomPercent}%
						</wa-button>
						<div class=viewer-zoom-menu>
							<div class=viewer-zoom-menu-title>Viewer Zoom</div>
							<wa-slider
								class=viewer-zoom-slider
								size="small"
								min=${minViewerZoom}
								max=${maxViewerZoom}
								step="0.01"
								.value=${viewerZoom()}
								@input=${selectViewerZoom}
							></wa-slider>
							<div class=viewer-zoom-presets>
								<wa-dropdown-item value="fit">Fit</wa-dropdown-item>
								<wa-dropdown-item value="0.5">50%</wa-dropdown-item>
								<wa-dropdown-item value="1">100%</wa-dropdown-item>
								<wa-dropdown-item value="1.5">150%</wa-dropdown-item>
								<wa-dropdown-item value="2">200%</wa-dropdown-item>
							</div>
						</div>
					</wa-dropdown>
				</div>
				<strong class=viewer-title>${title}</strong>
				<div class=viewer-actions>
					<span class=viewer-meta>
						${resolution} · ${settings.timebase} fps · ${settings.aspectRatio}
					</span>
					<button class=viewer-button title="Fullscreen" @click=${fullscreen}>
						${fullscreenSvg}
					</button>
				</div>
			</header>
			<div class=viewer-stage>
				<div class=viewer-canvas style=${`--viewer-zoom: ${viewerZoom()}`}>
					${canvas}
				</div>
			</div>
			${Toolbar(context)}
		</div>
	`
})

