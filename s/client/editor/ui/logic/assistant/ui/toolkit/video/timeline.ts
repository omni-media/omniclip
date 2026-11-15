
import {MediaContext} from './context.js'
import {MediaSplitter} from './splitter.js'
import {ReasoningEffort} from '../../parts/runtime.js'
import {mediaAnalysisClient} from '../../../../api.js'
import {TimelineAnalysis, TimelineSource} from './types.js'
import type {EditorContext} from '../../../../../../context/context.js'

export async function inspectTimeline(
	editor: EditorContext,
	prompt: string,
	reasoningEffort: ReasoningEffort,
	onProgress: (message: string) => void
) {
	const items = timelineSources(editor)

	if (!items.length)
		throw new Error('The timeline has no video or audio sources to inspect.')

	const sources = [...new Map(items.map(media => [media.mediaHash, media])).values()]
	const inspected = new Map<string, TimelineAnalysis[]>()

	let activeMediaHash: string

	const prepare = (media: TimelineSource, index: number) => {
		const promise = new MediaContext(
			editor.strata.projectId,
			media.mediaHash,
			new MediaSplitter(media.source, media.filename),
			progress => {
				if (media.mediaHash === activeMediaHash) {
					onProgress(
						`Providing source ${index + 1}/${sources.length} · ${Math.round(progress * 100)}%`
					)
				}
			}
		).provide()

		promise.catch(() => {})

		return promise
	}

	let prepared = prepare(sources[0]!, 0)

	for (const [index, media] of sources.entries()) {
		activeMediaHash = media.mediaHash

		const label = `source ${index + 1}/${sources.length}`

		onProgress(`Preparing ${label}`)
		const parts = await prepared

		if (sources[index + 1])
			prepared = prepare(sources[index + 1]!, index + 1)

		onProgress(`Inspecting ${label} with cloud model`)

		const analyses: TimelineAnalysis[] = []

		for (const {path, start, end} of parts) {
			const inspect = media.source.type.startsWith('audio/')
				? mediaAnalysisClient.inspectAudio
				: mediaAnalysisClient.inspectVideo
			const {analysis} = await inspect({
				path,
				prompt,
				reasoningEffort
			})

			analyses.push({
				itemId: media.itemId,
				mediaHash: media.mediaHash,
				start,
				end,
				analysis
			})
		}

		inspected.set(media.mediaHash, analyses)
	}

	return items.flatMap(media =>
		inspected.get(media.mediaHash)!.map(analysis => ({
			...analysis,
			itemId: media.itemId
		}))
	)
}

function timelineSources(editor: EditorContext) {
	return Array.from(
		editor.session.index.getMediaItems(editor.session.timeline.state.rootId),
		item => {
			const {blob: source, filename} = editor.project.resources.require(item.mediaHash)
			return {itemId: item.id, mediaHash: item.mediaHash, source, filename}
		}
	).filter(media => /^(video|audio)\//.test(media.source.type))
}

