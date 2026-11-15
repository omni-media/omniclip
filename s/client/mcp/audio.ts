
import type {AudioAnalyzeRequest, AudioAnalysis} from '@omnimedia/omniso/mcp/protocol'

import {mediaAnalysisClient} from '../editor/ui/logic/api.js'
import type {EditorContext} from '../editor/context/context.js'
import {MediaContext} from '../editor/ui/logic/assistant/ui/toolkit/video/context.js'
import {MediaSplitter} from '../editor/ui/logic/assistant/ui/toolkit/video/splitter.js'

export async function analyzeAudio(editor: EditorContext, input: AudioAnalyzeRequest, signal: AbortSignal): Promise<AudioAnalysis> {
	const index = editor.session.index
	const item = index.getItem(input.itemId)

	if (!('mediaHash' in item) || !('start' in item))
		throw new Error('Choose an audio or video item.')

	const {blob, filename, duration} = editor.project.resources.require(item.mediaHash)
	const start = input.start ?? item.start / 1000
	const end = input.end ?? (item.start + index.getItemDuration(item.id)) / 1000

	if (start < 0 || end <= start || end > duration / 1000)
		throw new Error('Choose a non-empty audio range within the source, in seconds.')

	signal.throwIfAborted()

	const cacheKey = `${item.mediaHash}/audio/${start}-${end}`
	const splitter = new MediaSplitter(blob, filename, {audioOnly: true, start, end}, signal)
	const parts = await new MediaContext(editor.strata.projectId, cacheKey, splitter, () => {}).provide()

	const analyses: AudioAnalysis['analyses'] = []
	for (const part of parts) {
		signal.throwIfAborted()
		const {analysis} = await mediaAnalysisClient.inspectAudio({
			path: part.path, prompt: input.prompt, reasoningEffort: 'low',
		})
		analyses.push({start: part.start, end: part.end, analysis})
	}
	signal.throwIfAborted()
	return {itemId: item.id, mediaHash: item.mediaHash, timingUnit: 'seconds', analyses}
}
