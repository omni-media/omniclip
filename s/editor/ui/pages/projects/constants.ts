
import {computeItemDuration} from '@omnimedia/omnitool/x/timeline/renderers/parts/handy.js'

import {Strata} from '../../../context/parts/strata.js'

export type SortMode = 'recent' | 'name' | 'duration'
export type ViewMode = 'grid' | 'list'

export const sortLabels: Record<SortMode, string> = {
	recent: 'Last Modified',
	name: 'Name',
	duration: 'Duration'
}

export type ProjectPreview = {
	id: string
	title: string
	thumbnail: string
	duration: string
	durationSeconds: number
	resolution: string
	aspectRatio: string
	fps: string
	edited: string
	editedRank: number
	favorite?: boolean
	timeline: number[]
	tags: string[]
	description: string
}

const fallbackThumbnails = [
	'/assets/demo2.png',
	'/assets/demo1.png',
	'/assets/landingpage1.png',
	'/assets/background.png',
	'/assets/omnistudio.png',
	'/assets/landingpage.png'
]

export async function loadProjectPreviews() {
	return (await Strata.loadProjects())
		.filter(project => project.state.timeline.present.items.length > 0)
		.map((project, index) => deriveProjectPreview(project, index))
}

function deriveProjectPreview(
	project: Awaited<ReturnType<typeof Strata.loadProjects>>[number],
	index: number,
): ProjectPreview {
	const {id, state} = project
	const timeline = state.timeline.present
	const durationSeconds = Math.round(computeItemDuration(timeline.rootId, timeline) / 1000)
	const tags = state.outliner.tags.map(tag => tag.name)

	return {
		id,
		title: titleFromId(id),
		thumbnail: fallbackThumbnails[index % fallbackThumbnails.length],
		duration: formatDuration(durationSeconds),
		durationSeconds,
		resolution: state.settings.resolution,
		aspectRatio: state.settings.aspectRatio,
		fps: `${state.settings.timebase}fps`,
		edited: formatRelativeEdit(state.updatedAt),
		editedRank: state.updatedAt ?? 0,
		favorite: state.outliner.items.some(item => item.starred),
		timeline: deriveTimelineStrip(timeline.items.length),
		tags,
		description: `${timeline.items.length} timeline items in a local Omniclip project.`
	}
}

function formatRelativeEdit(updatedAt: number) {
	const elapsedSeconds = Math.max(0, Math.floor((Date.now() - updatedAt) / 1000))
	const minute = 60
	const hour = minute * 60
	const day = hour * 24
	const week = day * 7

	if (elapsedSeconds < minute)
		return 'Edited just now'
	if (elapsedSeconds < hour)
		return `Edited ${Math.floor(elapsedSeconds / minute)} minutes ago`
	if (elapsedSeconds < day)
		return `Edited ${Math.floor(elapsedSeconds / hour)} hours ago`
	if (elapsedSeconds < day * 2)
		return 'Edited yesterday'
	if (elapsedSeconds < week)
		return `Edited ${Math.floor(elapsedSeconds / day)} days ago`

	return `Edited ${Math.floor(elapsedSeconds / week)} weeks ago`
}

function deriveTimelineStrip(count: number) {
	return Array.from({length: 12}, (_, index) => {
		const seed = ((count + 3) * (index + 5)) % 19
		return 7 + seed
	})
}

export function titleFromId(id: string) {
	return id
		.split(/[-_ ]+/)
		.filter(Boolean)
		.map(word => word[0]?.toUpperCase() + word.slice(1))
		.join(' ') || 'Untitled Project'
}

function formatDuration(seconds: number) {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = seconds % 60
	return [h, m, s]
		.map(value => value.toString().padStart(2, '0'))
		.join(':')
}
