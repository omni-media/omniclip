
import {makeBgRemover} from "@omnimedia/omnitool"
export {backgroundRemoverModels, type BgRemoverModel} from "../../../../../../../../logic/models/bg-remover.js"

export const bgRemoverWorkerPath = new URL(
	"/node_modules/@omnimedia/omnitool/x/features/bg-remover/worker.bundle.min.js",
	import.meta.url
)

export type BgRemover = Awaited<ReturnType<typeof makeBgRemover>>
