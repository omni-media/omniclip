export interface ProgressItem {
	file: string
	loaded: number
	progress: number
	total: number
	name: string
	status: string
}

export interface TranscriberUpdateData {
	data: {
		text: string
		chunks: { text: string; timestamp: [number, number | null] }[]
		tps: number
	};
}

export interface TranscriberData {
	isBusy: boolean
	tps?: number
	text: string
	chunks: { text: string; timestamp: [number, number | null] }[]
}

export interface Transcriber {
	onInputChange: () => void
	isBusy: boolean
	isModelLoading: boolean
	progressItems: ProgressItem[]
	start: (audioData: AudioBuffer | undefined) => void
	output?: TranscriberData
	model: string
	setModel: (model: string) => void
	multilingual: boolean
	setMultilingual: (model: boolean) => void
	subtask: string
	setSubtask: (subtask: string) => void
	language?: string
	setLanguage: (language: string) => void
}
