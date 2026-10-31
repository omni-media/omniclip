
import type {MediaLibrary} from '@e280/quay'
import {debounce, queue, Scope} from '@e280/stz'
import {batch, derived, effect, RMap, RSet, signal} from '@e280/strata'

import {SearchClient} from './worker.js'
import type {MediaRecord, Progress} from './types.js'

type SearchMode = 'off' | 'on' | 'paused'

export class MediaSearch {
	#selected
	#job?: object
	#scope = new Scope()
	#completed = new RSet<string>()
	#mode = signal<SearchMode>('off')
	#records = new RMap<string, MediaRecord>()
	#scores = new RMap<string, number>()
	#worker = new SearchClient(
		progress => this.progress(progress),
		notice => this.notice(notice),
	)
	#fail = (cause: unknown) => { this.error(String(cause)) }

	readonly enabled = derived(() => ['on', 'paused'].includes(this.#mode()))
	readonly paused = derived(() => this.#mode() === 'paused')
	readonly progress = signal<Progress>({kind: 'prepare', stage: 'Preparing model', loaded: 0, total: 0})
	readonly error = signal('')
	readonly notice = signal('')
	readonly modelDownloaded = this.#worker.downloaded
	readonly queue = derived(() => {
		const completed = [...this.#records.keys()].filter(hash => this.#completed.has(hash)).length
		return {completed, total: this.#records.size}
	})

	constructor(libraries: MediaLibrary[]) {
		this.#selected = libraries[0]
		for (const library of libraries) this.#bind(library)
	}

	start() {
		this.#mode('on')
		if (this.progress().kind === 'idle') {
			this.progress({kind: 'check', stage: 'Checking media', loaded: 0, total: 0})
		}
		this.#refreshRecords(this.#selected)
	}

	disable() {
		this.#mode('off')
		this.#stop()
		this.#scores.clear()
	}

	pause() {
		this.#mode('paused')
		this.#stop()
	}

	resume() {
		this.#mode('on')
		this.#refreshRecords(this.#selected)
	}

	dispose() {
		this.#mode('off')
		this.#job = undefined
		this.#scope.dispose()
		this.#worker.dispose()
	}

	select(library: MediaLibrary) {
		if (library !== this.#selected) {
			this.#stop()
			this.#records.clear()
			this.#scores.clear()
		}
		this.#selected = library
		this.#refreshRecords(library)
	}

	async removeIndex(hash: string) {
		this.#completed.delete(hash)
		this.#records.delete(hash)
		this.#scores.delete(hash)
		await this.#worker.request(worker => worker.remove(hash))
	}

	#stop() {
		if (this.progress().kind === 'index') {
			void this.#worker.request(worker => worker.cancel()).catch(this.#fail)
		}
	}

	#refreshRecords(library: MediaLibrary) {
		if (library !== this.#selected) return
		const job = this.#job = {}
		batch(() => {
			this.#records.clear()
			for (const [item] of library.config.root.crawl()) {
				if (!item.isKind('file')) continue
				const {hash, label, format} = item.specimen
				if (hash && format !== 'other') this.#records.set(hash, {hash, label, format})
			}
		})
		const currentHash = this.progress().hash
		if (currentHash && !this.#records.has(currentHash)) this.#stop()
		void this.#run(job).catch(this.#fail)
	}

	#run = queue(async (job: object) => {
		const active = () => job === this.#job && this.#mode() === 'on'
		if (!active()) return
		this.error('')
		await this.#worker.request(worker => worker.prepare())
		for (const record of this.#records.values()) {
			if (!active()) break
			if (this.#completed.has(record.hash)) continue
			if (this.progress().hash !== record.hash) {
				this.progress({
					kind: 'index', stage: `Indexing ${record.label} · 0%`,
					loaded: 0, total: 1, hash: record.hash,
				})
			}
			try {
				const {file} = await this.#selected.cellar.load(record.hash)
				if (!active() || !this.#records.has(record.hash)) break
				const completed = await this.#worker.request(worker => worker.index(record, file))
				if (completed && this.#records.has(record.hash)) this.#completed.add(record.hash)
			} catch (cause) {
				this.#fail(cause)
			}
		}
		if (active()) this.progress({kind: 'idle', stage: '', loaded: 0, total: 0})
		void this.#search()
	})

	async #search() {
		const library = this.#selected
		const query = library.searchText().trim()
		const status = this.progress().kind
		this.#scores.clear()
		if (!this.enabled() || (status !== 'index' && status !== 'idle')) return
		if (!query) return
		try {
			const scores = await this.#worker.request(worker => worker.search(query, [...this.#records.keys()]))
			if (library !== this.#selected || query !== library.searchText().trim() || !this.enabled()) return
			batch(() => {
				for (const [hash, score] of scores) this.#scores.set(hash, score)
			})
		} catch (cause) {
			this.#fail(cause)
		}
	}

	#bind(library: MediaLibrary) {
		const {search: original, sorts} = library.config
		const score = (item: Parameters<typeof original>[1]) => {
			if (library !== this.#selected || !item.isKind('file')) return undefined
			const hash = item.specimen.hash ?? ''
			return this.#records.has(hash) ? this.#scores.get(hash) : undefined
		}
		library.config.search = (terms, item) =>
			original(terms, item) || (this.enabled() && score(item) !== undefined)

		let sort = library.selectedSort()
		const search = debounce(300, () => {
			if (library === this.#selected) return this.#search()
		})
		this.#scope.add(effect(this.enabled, enabled => {
			if (enabled === sorts.has('AI relevance')) return
			if (enabled) {
				sort = library.selectedSort()
				sorts.set('AI relevance', (a, b) => (score(b) ?? -1) - (score(a) ?? -1))
				library.selectedSort('AI relevance')
			} else {
				library.selectedSort(sort)
				sorts.delete('AI relevance')
			}
		}))
		this.#scope.add(library.searchText.on(() => {
			this.#scores.clear()
			void search()
		}))
		this.#scope.add(library.on.refresh(() => this.#refreshRecords(library)))
		this.#scope.add(() => { library.config.search = original })
	}
}

