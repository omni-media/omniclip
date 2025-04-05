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
		GLTransitions: GLTransition[]
	}
}

declare global {
	const PIXI: typeof import("pixi.js")
}

export interface GLTransition {
	author: string
	createdAt: string
	glsl: string
	license: string
	name: string
	updatedAt: string
	defaultParams: any
	paramsTypes: any
}

