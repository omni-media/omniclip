import {filters} from "fabric"

declare module 'fabric' {
	namespace filters {
		interface BaseFilter {
			for?: "filter" | "animation"
		}
	}
}

interface FontMetadata {
	family: string
	fullName: string
	postscriptName: string
	style: string
	weight: number
}


declare global {
	interface Window {
		queryLocalFonts(): Promise<FontMetadata[]>
	}
}
