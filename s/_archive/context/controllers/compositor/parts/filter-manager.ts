import {pub} from "@benev/slate"

import {Compositor} from "../controller.js"
import {Actions} from "../../../actions.js"
import {ImageEffect, VideoEffect} from "../../../types.js"

//@ts-ignore
const filters = {...PIXI, ...PIXI.filters}
export interface Filter {
	targetEffectId: string
	type: FilterType
}

export class FiltersManager {
	onChange = pub()

	constructor(private compositor: Compositor, private actions: Actions) {}

	selectedFilterForEffect(effect: VideoEffect | ImageEffect | null, type: FilterType) {
		if(!effect) return
		const object = this.#getObject(effect)
		if(object) {
			if(object.filters instanceof Array) {
				//@ts-ignore
				const haveFilter = object.filters.find(filter => filter.name === type)
				if(haveFilter) {
					return true
				} else return false
			}
		}
	}

	#getObject(effect: VideoEffect | ImageEffect) {
		const videoObject = this.compositor.managers.videoManager.get(effect.id)?.sprite
		const imageObject = this.compositor.managers.imageManager.get(effect.id)?.sprite
		if(videoObject) {
			return videoObject
		} else if(imageObject) {
			return imageObject
		}
	}

	addFilterToEffect(
		effect: ImageEffect | VideoEffect,
		type: FilterType,
		recreate?: boolean
	) {
		const object = this.#getObject(effect)
		if (!object) {
			return
		}
		
		if(object.filters === undefined)
			object.filters = []

		if(object.filters instanceof Array === false)
			object.filters = []

		const alreadyHasThisFilter = object.filters.find(
			(f: any) => f.name === type
		)

		if (alreadyHasThisFilter) {
			this.removeFilterFromEffect(effect, type, recreate)
		} else {
			const filter = new filters[type]()
			filter.name = type
			object.filters = [...object.filters, filter]
			if (!recreate) {
				this.actions.add_filter({ targetEffectId: effect.id, type })
			}
			this.compositor.app.render()
		}

		this.onChange.publish(true)
	}

	removeFilterFromEffect(
		effect: ImageEffect | VideoEffect,
		type: FilterType,
		recreate?: boolean
	) {
		const object = this.#getObject(effect)!
		if (!recreate) {
			this.actions.remove_filter(effect, type)
		}
		if(object.filters instanceof Array)
			object.filters = object.filters.filter((f: any) => f.name !== type)

		this.onChange.publish(true)
		this.compositor.app.render()
	}

	updateEffectFilter(
		effect: ImageEffect | VideoEffect,
		filterName: string,
		propertyPath: string | string[],
		value: any
	) {
		const object = this.#getObject(effect)!
		if (Array.isArray(object.filters)) {
			const filter = object.filters.find(
				(f: any) =>
					f.name === filterName
			)
			if (filter) {
				const keys = Array.isArray(propertyPath) ? propertyPath : [propertyPath]
				let target = filter
				for (let i = 0; i < keys.length - 1; i++) {
					target = (target as any)[keys[i]]
					if (!target) {
						console.warn(`Invalid property path: ${keys.join('.')}`)
						return
					}
				}
				(target as any)[keys[keys.length - 1]] = value
				this.compositor.app.render()
			}
		}
	}

	async createFilterPreviews(onCreatedPreview: ({canvas, type, uid}: {canvas: PIXI.ICanvas, type: FilterType, uid: number}) => void) {
		const webp = await fetch("/assets/filter-preview.webp")
		for(const schema in FilterSchemas) {
			const texture = await PIXI.Assets.load({src: webp.url, format: webp.type, loadParser: 'loadTextures'})
			const image = new PIXI.Sprite(texture)
			image.filters = []
			const s = schema as FilterType
			// temporal hack to avoid errors with not working filters
			try {
				const filter = new filters[s](image)
				image.filters = [...image.filters, filter]
				const canvas = this.compositor.app.renderer.extract.canvas(image)
				onCreatedPreview({canvas, type: s, uid: filter.uid})
			} catch(e) {}
		}
	}
}

export type ChoiceOptions = string[] | Record<string, string | number> | number[]

export type ChoiceFilterProperty = {
	type: "choice"
	options: ChoiceOptions
	default: string | number
}

export type NumericFilterProperty = {
	type: "number"
	min: number
	max: number
	default: number
}

export type ColorFilterProperty = {
	type: "color"
	default: string
}

export type BooleanFilterProperty = {
	type: "boolean"
	default: boolean
}

export type ObjectFilterProperty = {
	type: "object"
	properties: Record<string, FilterPropertyConfig>
}

export type ArrayFilterProperty = {
	type: "array"
	items: FilterPropertyConfig[]
}

export type FilterPropertyConfig =
	| NumericFilterProperty
	| ColorFilterProperty
	| BooleanFilterProperty
	| ChoiceFilterProperty
	| ObjectFilterProperty
	| ArrayFilterProperty

export type SchemaFromOptions<T> = {
	[K in keyof Required<T>]: FilterPropertyConfig
}

export type FilterType =
  | "BlurFilter"
  | "AlphaFilter"
  | "NoiseFilter"
  | "AsciiFilter"
  | "CRTFilter"
  | "PixelateFilter"
  | "TwistFilter"
  | "OldFilmFilter"
	| "OutlineFilter"
	| "RadialBlurFilter"
	| "ReflectionFilter"
	| "RGBSplitFilter"
	| "ShockwaveFilter"
	| "SimpleLightmapFilter"
	| "SimplexNoiseFilter"
	| "TiltShiftFilter"
	| "ZoomBlurFilter"
	| "AdjustmentFilter"
	| "AdvancedBloomFilter"
	| "BackdropBlurFilter"
	| "BevelFilter"
	| "BloomFilter"
	| "BulgePinchFilter"
	| "ColorGradientFilter"
	| "ColorMapFilter"
	| "ColorOverlayFilter"
	| "ColorReplaceFilter"
	| "ConvolutionFilter"
	| "CrossHatchFilter"
	| "DotFilter"
	| "DropShadowFilter"
	| "EmbossFilter"
	| "GlitchFilter"
	| "GlowFilter"
	| "GodrayFilter"
	| "GrayscaleFilter"
	| "HslAdjustmentFilter"
	| "KawaseBlurFilter"
	| "MotionBlurFilter"
	// | "MultiColorReplaceFilter"
	// | "ColorMatrixFilter"

export interface FilterSchema {
	[property: string]: FilterPropertyConfig
}

export const FilterSchemas: Record<FilterType, FilterSchema> = {
	MotionBlurFilter: {
		velocity: {
			type: "object",
			properties: {
				x: { type: "number", min: -90, max: 90, default: 40 },
				y: { type: "number", min: -90, max: 90, default: 40 },
			},
		},
		kernelSize: { type: "choice", default: "15", options: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]},
		offset: { type: "number", min: -150, max: 150, default: 0 },
	},
	KawaseBlurFilter: {
		strength: { type: "number", min: 0, max: 20, default: 4 },
		quality: { type: "number", min: 1, max: 20, default: 3 },
		pixelSize: {
			type: "object",
			properties: {
				x: { type: "number", min: 0, max: 10, default: 1 },
				y: { type: "number", min: 0, max: 10, default: 1 },
			},
		},
	},
	HslAdjustmentFilter: {
		hue: { type: "number", min: -180, max: 180, default: 0 },
		saturation: { type: "number", min: -1, max: 1, default: 0 },
		lightness: { type: "number", min: -1, max: 1, default: 0 },
		colorize: { type: "boolean", default: false },
		alpha: { type: "number", min: 0, max: 1, default: 1 },
	},
	GlowFilter: {
		distance: { type: "number", min: 0, max: 20, default: 15 },
		innerStrength: { type: "number", min: 0, max: 20, default: 0 },
		outerStrength: { type: "number", min: 0, max: 20, default: 2 },
		color: { type: "color", default: "ffffff" },
		quality: { type: "number", min: 0, max: 1, default: 0.2 },
		alpha: { type: "number", min: 0, max: 1, default: 1 },
		knockout: { type: "boolean", default: false },
	},
	GodrayFilter: {
		animating: { type: "boolean", default: true },
		time: { type: "number", min: 0, max: 1, default: 0 },
		gain: { type: "number", min: 0, max: 1, default: 0.6 },
		lacunarity: { type: "number", min: 0, max: 5, default: 2.75 },
		alpha: { type: "number", min: 0, max: 1, default: 1 },
		parallel: { type: "boolean", default: true },
		angle: { type: "number", min: -60, max: 60, default: 30 },
		center: {
			type: "object",
			properties: {
				x: { type: "number", min: -100, max: 2012, default: 956 },
				y: { type: "number", min: -1000, max: -100, default: -100 },
			},
		},
	},
	GrayscaleFilter: {

	},
	CrossHatchFilter: {

	},
	ColorReplaceFilter: {
		originalColor: { type: "color", default: "ff0000" },
		targetColor: { type: "color", default: "000000" },
		tolerance: { type: "number", min: 0, max: 1, default: 0.4 },
	},
	ColorOverlayFilter: {
		color: { type: "color", default: "ff0000" },
		alpha: { type: "number", min: 0, max: 1, default: 0.5 },
	},
	ColorMapFilter: {
		mix: { type: "number", min: 0, max: 1, default: 0.5 },
		nearest: { type: "boolean", default: false },
	},
	ConvolutionFilter: {
		width: { type: "number", min: 0, max: 500, default: 300 },
		height: { type: "number", min: 0, max: 500, default: 300 },
		matrix: {
			type: "array", items: [
				{ type: "number", min: 0, max: 1, default: 0 },
				{ type: "number", min: 0, max: 1, default: 0.5 },
				{ type: "number", min: 0, max: 1, default: 0 },
				{ type: "number", min: 0, max: 1, default: 0.5 },
				{ type: "number", min: 0, max: 1, default: 1 },
				{ type: "number", min: 0, max: 1, default: 0.5 },
				{ type: "number", min: 0, max: 1, default: 0 },
				{ type: "number", min: 0, max: 1, default: 0.5 },
				{ type: "number", min: 0, max: 1, default: 0 },
			]
		}
	},
	DropShadowFilter: {
		blur: { type: "number", min: 0, max: 20, default: 2 },
		quality: { type: "number", min: 1, max: 20, default: 3 },
		alpha: { type: "number", min: 0, max: 1, default: 0.5 },
		offset: {
			type: "object",
			properties: {
				x: { type: "number", min: -50, max: 50, default: 4 },
				y: { type: "number", min: -50, max: 50, default: 4 },
			},
		},
		color: { type: "color", default: "000000" },
		shadowOnly: { type: "boolean", default: false },
	},
	EmbossFilter: {
		strength: { type: "number", min: 0, max: 20, default: 5 },
	},
	GlitchFilter: {
		animating: { type: "boolean", default: true },
		seed: { type: "number", min: 0, max: 1, default: 0.5 },
		offset: { type: "number", min: -400, max: 400, default: 100 },
		direction: { type: "number", min: -180, max: 180, default: 0 },
		fillMode: { type: "choice", default: "LOOP",
			options: {
				TRANSPARENT: 0,
				ORIGINAL: 1,
				LOOP: 2,
				CLAMP: 3,
				MIRROR: 4,
			}
		},
		red: {
			type: "object",
			properties: {
				x: { type: "number", min: -50, max: 50, default: 2 },
				y: { type: "number", min: -50, max: 50, default: 2 },
			},
		},
		blue: {
			type: "object",
			properties: {
				x: { type: "number", min: -50, max: 50, default: 10 },
				y: { type: "number", min: -50, max: 50, default: -4 },
			},
		},
		green: {
			type: "object",
			properties: {
				x: { type: "number", min: -50, max: 50, default: -10 },
				y: { type: "number", min: -50, max: 50, default: 4 },
			},
		},
	},
	DotFilter: {
		scale: { type: "number", min: 0.3, max: 1, default: 1 },
		angle: { type: "number", min: 0, max: 5, default: 5 },
		grayscale: { type: "boolean", default: true },
	},
	AdjustmentFilter: {
		gamma: { type: "number", min: 0, max: 5, default: 1 },
		saturation: { type: "number", min: 0, max: 5, default: 1 },
		contrast: { type: "number", min: 0, max: 5, default: 1 },
		brightness: { type: "number", min: 0, max: 5, default: 1 },
		red: { type: "number", min: 0, max: 5, default: 1 },
		green: { type: "number", min: 0, max: 5, default: 1 },
		blue: { type: "number", min: 0, max: 5, default: 1 },
		alpha: { type: "number", min: 0, max: 1, default: 1 },
	},
	AdvancedBloomFilter: {
		threshold: { type: "number", min: 0.1, max: 0.9, default: 0.5 },
		bloomScale: { type: "number", min: 0.5, max: 1.5, default: 1 },
		brightness: { type: "number", min: 0.5, max: 1.5, default: 1 },
		blur: { type: "number", min: 0, max: 20, default: 8 },
		quality: { type: "number", min: 1, max: 20, default: 4 },
	},
	BackdropBlurFilter: {
		blur: { type: "number", min: 0, max: 100, default: 8 },
		quality: { type: "number", min: 1, max: 10, default: 4 },
	},
	BevelFilter: {
		rotation: { type: "number", min: 0, max: 360, default: 45 },
		thickness: { type: "number", min: 0, max: 10, default: 2 },
		lightColor: { type: "color", default: "ffffff" },
		lightAlpha: { type: "number", min: 0, max: 1, default: 0.7 },
		shadowColor: { type: "color", default: "000000" },
		shadowAlpha: { type: "number", min: 0, max: 1, default: 0.7 },
	},
	BlurFilter: {
		strength: { type: "number", min: 0, max: 100, default: 8 },
		quality: { type: "number", min: 1, max: 10, default: 4 },
	},
	BloomFilter: {
		value: { type: "number", min: 0, max: 20, default: 2 },
		strength: {
			type: "object",
			properties: {
				x: { type: "number", min: 0, max: 20, default: 2 },
				y: { type: "number", min: 0, max: 20, default: 2 },
			},
		},
	},
	BulgePinchFilter: {
		radius: { type: "number", min: 0, max: 1000, default: 100 },
		strength: { type: "number", min: -1, max: 1, default: 1 },
		center: {
			type: "object",
			properties: {
				x: { type: "number", min: 0, max: 1, default: 0.5 },
				y: { type: "number", min: 0, max: 1, default: 0.5 },
			},
		},
	},
	ColorGradientFilter: {
		
	},
	AlphaFilter: {
		alpha: { type: "number", min: 0, max: 1, default: 1 },
	},
	NoiseFilter: {
		noise: { type: "number", min: 0, max: 1, default: 0.5 },
		seed: { type: "number", min: 0.01, max: 10, default: 0.5 },
	},
	AsciiFilter: {
		size: { type: "number", min: 2, max: 20, default: 8 },
		color: { type: "color", default: "#ffffff" },
		replaceColor: { type: "boolean", default: false },
	},
	CRTFilter: {
		curvature: { type: "number", min: 0, max: 10, default: 1 },
		lineWidth: { type: "number", min: 0, max: 5, default: 3 },
		lineContrast: { type: "number", min: 0, max: 1, default: 0.3 },
		verticalLine: { type: "boolean", default: false },
		noise: { type: "number", min: 0, max: 1, default: 0.2 },
		noiseSize: { type: "number", min: 1, max: 10, default: 1 },
		vignetting: { type: "number", min: 0, max: 1, default: 0.3 },
		vignettingAlpha: { type: "number", min: 0, max: 1, default: 1 },
		vignettingBlur: { type: "number", min: 0, max: 1, default: 0.3 },
		seed: { type: "number", min: 0, max: 1, default: 0 },
		time: { type: "number", min: 0.5, max: 20, default: 0.5 },
	},
	PixelateFilter: {
		size: {
			type: "object",
			properties: {
				x: { type: "number", min: 4, max: 40, default: 10 },
				y: { type: "number", min: 4, max: 40, default: 10 },
			},
		},
	},
	TwistFilter: {
		angle: { type: "number", min: -10, max: 10, default: 4 },
		radius: { type: "number", min: 0, max: 1912, default: 200 },
		offsetX: { type: "number", min: 0, max: 1912, default: 956 },
		offsetY: { type: "number", min: 0, max: 920, default: 460 },
	},
	OldFilmFilter: {
		sepia: { type: "number", min: 0, max: 1, default: 0.3 },
		noise: { type: "number", min: 0, max: 1, default: 0.3 },
		noiseSize: { type: "number", min: 1, max: 10, default: 1 },
		scratch: { type: "number", min: -1, max: 1, default: 0.5 },
		scratchDensity: { type: "number", min: 0, max: 1, default: 0.3 },
		scratchWidth: { type: "number", min: 1, max: 20, default: 1 },
		vignetting: { type: "number", min: 0, max: 1, default: 0.3 },
		vignettingAlpha: { type: "number", min: 0, max: 1, default: 1 },
		vignettingBlur: { type: "number", min: 0, max: 1, default: 0.3 },
	},
	OutlineFilter: {
		thickness: { type: "number", min: 0, max: 10, default: 4 },
		color: { type: "color", default: "#000000" },
		alpha: { type: "number", min: 0, max: 1, default: 1 },
		knockout: { type: "boolean", default: false },
	},
	RadialBlurFilter: {
		angle: { type: "number", min: -180, max: 180, default: 20 },
		radius: { type: "number", min: -1, max: 1912, default: 300 },
		center: {
			type: "object",
			properties: {
				x: { type: "number", min: 0, max: 1912, default: 956 },
				y: { type: "number", min: 0, max: 920, default: 460 },
			},
		},
		kernelSize: { type: "choice", options: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25], default: 15}
	},
	ReflectionFilter: {
		animating: { type: "boolean", default: true },
		mirror: { type: "boolean", default: true },
		boundary: { type: "number", min: 0, max: 1, default: 0.5 },
		amplitude: {
			type: "object",
			properties: {
				start: { type: "number", min: 0, max: 50, default: 0 },
				end: { type: "number", min: 0, max: 50, default: 20 },
			}
		},
		waveLength: {
			type: "object",
			properties: {
				start: { type: "number", min: 10, max: 200, default: 30 },
				end: { type: "number", min: 10, max: 200, default: 100 },
			}
		},
		alpha: {
			type: "object",
			properties: {
				start: { type: "number", min: 0, max: 1, default: 1 },
				end: { type: "number", min: 0, max: 1, default: 1 },
			}
		},
		time: { type: "number", min: 0, max: 20, default: 0 }
	},
	RGBSplitFilter: {
		red: {
			type: "object",
			properties: {
				x: { type: "number", min: -20,  max: 20, default: -10 },
				y: { type: "number", min: -20,  max: 20, default: 0 }
			}
		},
		blue: {
			type: "object",
			properties: {
				x: { type: "number", min: -20,  max: 20, default: 0 },
				y: { type: "number", min: -20,  max: 20, default: 0 }
			}
		},
		green: {
			type: "object",
			properties: {
				x: { type: "number", min: -20,  max: 20, default: 0 },
				y: { type: "number", min: -20,  max: 20, default: 10 }
			}
		}
	},
	ShockwaveFilter: {
		animating: { type: "boolean", default: true },
		speed: { type: "number", min: 500,  max: 2000, default: 500 },
		amplitude: { type: "number", min: 1,  max: 100, default: 30 },
		wavelength: { type: "number", min: 2,  max: 400, default: 160 },
		brightness: { type: "number", min: 0.2,  max: 2, default: 1 },
		radius: { type: "number", min: 100,  max: 2000, default: -1 },
		center: {
			type: "object",
			properties: {
				x: { type: "number", min: 0,  max: 1912, default: 956 },
				y: { type: "number", min: 0,  max: 920, default: 460 }
			}
		}
	},
	SimpleLightmapFilter: {
		color: { type: "color", default: "666666" },
		alpha: { type: "number", min: 0,  max: 1, default: 1 }
	},
	SimplexNoiseFilter: {
		strength: { type: "number", min: 0,  max: 1, default: 0.5 },
		noiseScale: { type: "number", min: 0,  max: 50, default: 10 },
		offset: {
			type: "object",
			properties: {
				x: { type: "number", min: 0,  max: 5, default: 0 },
				y: { type: "number", min: 0,  max: 5, default: 0 },
				z: { type: "number", min: 0,  max: 5, default: 0 }
			}
		},
		step: { type: "number", min: -1, max: 1, default: -1 },
	},
	TiltShiftFilter: {
		blur: { type: "number", min: 0,  max: 200, default: 100 },
		gradientBlur: { type: "number", min: 0,  max: 1000, default: 600 },
		start: {
			type: "object",
			properties: {
				x: { type: "number", min: 0,  max: 1912, default: 0 },
				y: { type: "number", min: 0,  max: 920, default: 460 },
			}
		},
		end: {
			type: "object",
			properties: {
				x: { type: "number", min: 0,  max: 1912, default: 1912 },
				y: { type: "number", min: 0,  max: 920, default: 460 },
			}
		},
	},
	ZoomBlurFilter: {
		strength: { type: "number", min: 0.01,  max: 0.5, default: 0.1 },
		center: {
			type: "object",
			properties: {
				x: { type: "number", min: 0,  max: 1912, default: 956 },
				y: { type: "number", min: 0,  max: 920, default: 460 },
			}
		},
		innerRadius: { type: "number", min: 0,  max: 956, default: 80 },
		radius: { type: "number", min: 0,  max: 956, default: -1 },
	}
}
