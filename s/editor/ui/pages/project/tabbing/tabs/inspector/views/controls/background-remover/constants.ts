
import {makeBgRemover} from "@omnimedia/omnitool"

export const BG_REMOVER_MODELS = [
	["Xenova/modnet", "MODNet"],
	["onnx-community/ISNet-ONNX", "ISNet"],
	["briaai/RMBG-1.4", "RMBG 1.4"],
] as const

export const bgRemoverWorkerPath = new URL(
	"/node_modules/@omnimedia/omnitool/x/features/bg-remover/worker.bundle.min.js",
	import.meta.url
)

export type BgRemoverModel = typeof BG_REMOVER_MODELS[number][0]
export type BgRemover = Awaited<ReturnType<typeof makeBgRemover>>
