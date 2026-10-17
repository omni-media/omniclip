
import {ReasoningEffort} from '../../parts/runtime.js'
import {VideoContext, mediaAnalysis} from './context.js'
import {TimelineAnalysis, TimelineVideo} from './types.js'
import type {EditorContext} from '../../../../../../context/context.js'

export async function inspectTimeline(
	editor: EditorContext,
	prompt: string,
	reasoningEffort: ReasoningEffort,
	onProgress: (message: string) => void
) {
	const videos = timelineVideos(editor)

	if (!videos.length)
		throw new Error('The timeline has no video sources to inspect.')

	const sources = [...new Map(videos.map(video => [video.mediaHash, video])).values()]
	const inspected = new Map<string, TimelineAnalysis[]>()

	let activeMediaHash: string

	const prepare = (video: TimelineVideo, index: number) => {
		const promise = new VideoContext(
			editor.strata.projectId,
			video.mediaHash,
			video.source,
			progress => {
				if (video.mediaHash === activeMediaHash) {
					onProgress(
						`Providing video ${index + 1}/${sources.length} · ${Math.round(progress * 100)}%`
					)
				}
			}
		).provide()

		promise.catch(() => {})

		return promise
	}

	let prepared = prepare(sources[0]!, 0)

	for (const [index, video] of sources.entries()) {
		activeMediaHash = video.mediaHash

		const label = `video ${index + 1}/${sources.length}`

		onProgress(`Preparing ${label}`)
		const parts = await prepared

		if (sources[index + 1])
			prepared = prepare(sources[index + 1]!, index + 1)

		onProgress(`Inspecting ${label} with cloud model`)

		const analyses: TimelineAnalysis[] = []

		for (const {fileName, start, end} of parts) {
			const {analysis} = await mediaAnalysis.inspectVideo({
				fileName,
				prompt,
				reasoningEffort
			})

			analyses.push({
				itemId: video.itemId,
				mediaHash: video.mediaHash,
				start,
				end,
				analysis
			})
		}

		inspected.set(video.mediaHash, analyses)
	}

	return videos.flatMap(video =>
		inspected.get(video.mediaHash)!.map(analysis => ({
			...analysis,
			itemId: video.itemId
		}))
	)
}

function timelineVideos(editor: EditorContext) {
	return Array.from(
		editor.session.index.getMediaItems(editor.session.timeline.state.rootId),
		item => ({
			itemId: item.id,
			mediaHash: item.mediaHash,
			source: editor.project.resources.require(item.mediaHash).blob
		})
	).filter(video => video.source.type.startsWith('video/'))
}

