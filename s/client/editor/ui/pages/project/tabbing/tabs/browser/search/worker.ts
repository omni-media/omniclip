
import {signal} from "@e280/strata"
import {defer, ev} from "@e280/stz"
import {acceptWorkerPort, autoTransfer} from "@e280/renraku/web"
import {makeEndpoint, makePortal, Messenger, type Portal} from "@e280/renraku"

import {modelUrl, modelCache} from "./model.js"
import type {Progress, SearchHost, SearchWorker} from "./types.js"

export class SearchClient {
	readonly downloaded = signal(false)
	#worker?: Worker
	#portal?: Promise<Portal<SearchWorker>>
	#abort = new AbortController()

	constructor(
		private onProgress: (progress: Progress) => void,
		private onNotice: (notice: string) => void,
	) {
		void caches.match(modelUrl, {cacheName: modelCache})
			.then(cached => this.downloaded(!!cached)).catch(() => {})
	}

	async request<T>(call: (worker: SearchWorker) => Promise<T>) {
		const signal = this.#abort.signal
		signal.throwIfAborted()
		if (!this.#portal) {
			const worker = this.#worker = new Worker("/editor/workers/media-search.worker.bundle.min.js", {type: "module"})
			worker.onerror = () => this.dispose(new Error("AI search worker failed. Reload to try again."))
			const host: SearchHost = {
				progress: async progress => this.onProgress(progress),
				notice: async notice => this.onNotice(notice),
				downloaded: async() => { this.downloaded(true) },
			}
			this.#portal = acceptWorkerPort(worker).then(port => makePortal({
				port, messenger: new Messenger<SearchWorker>(makeEndpoint(host), Infinity), autoTransfer,
			}))
		}
		const stopped = defer<never>()
		const unlisten = ev(signal, {abort: () => stopped.reject(signal.reason)})
		return Promise.race([this.#portal.then(portal => {
			signal.throwIfAborted()
			return call(portal.remote)
		}), stopped]).finally(unlisten)
	}

	dispose(reason = new Error("Search closed")) {
		this.#abort.abort(reason)
		this.#worker?.terminate()
		void this.#portal?.then(portal => {
			portal.dispose()
			portal.port.close()
		})
	}
}

