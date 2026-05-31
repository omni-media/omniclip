import {makeBgRemover} from "@omnimedia/omnitool"

export const bgRemoverWorkerPath = new URL(
	"/node_modules/@omnimedia/omnitool/x/features/bg-remover/worker.bundle.min.js",
	import.meta.url
)

export type BgRemover = Awaited<ReturnType<typeof makeBgRemover>>

export const formatProgress = (n: number, label: string) =>
	Number.isFinite(n) ? `${label} ${n}%` : `${label}...`
