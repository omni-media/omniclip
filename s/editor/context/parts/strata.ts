
import {Kv, StorageDriver} from '@e280/kv'
import {Prism, Chrono, Vault, LocalStore} from '@e280/strata'

import {makeDefaultState, State} from './state.js'

export class Strata {
	static storageScope = 'omniclip:project'
	static defaultProjectId = 'default'
	static storageVersion = 1

	static #projects(storage: Storage = window.localStorage) {
		return new Kv<{version: number, state: State}>(new StorageDriver(storage))
			.scope(this.storageScope)
	}

	static storageKey(projectId: string) {
		return `${this.storageScope}:${projectId}`
	}

	static async listProjectIds(storage: Storage = window.localStorage) {
		const ids: string[] = []
		for await (const id of this.#projects(storage).keys())
			ids.push(id)
		return ids.sort()
	}

	static async loadProject(projectId: string, storage: Storage = window.localStorage) {
		const strata = new Strata(projectId, storage)
		await strata.vault.load()
		return strata.trunk.get()
	}

	static async loadProjects(storage: Storage = window.localStorage) {
		const projects: {id: string, state: State}[] = []
		for (const id of await this.listProjectIds(storage)) {
			const state = await this.loadProject(id, storage)
			if (state)
				projects.push({id, state})
		}
		return projects.sort((a, b) => a.id.localeCompare(b.id))
	}

	static async setup(projectId = Strata.defaultProjectId) {
		const strata = new Strata(projectId)
		await strata.vault.load()
		strata.listen()
		return strata
	}

	static async createProject(projectId: string) {
		const strata = new Strata(projectId)
		await strata.trunk.set(makeDefaultState(true))
		await strata.save()
		return projectId
	}

	store
	vault
	#stopChanges = () => {}
	#stopStorage = () => {}
	trunk = new Prism<State>(makeDefaultState())

	settings = this.trunk.lens(s => s.settings)
	files = this.trunk.lens(s => s.files)
	metadata = this.trunk.lens(s => s.metadata)
	timeline = new Chrono(64, this.trunk.lens(state => state.timeline))
	outliner = this.trunk.lens(s => s.outliner)

	constructor(
		public projectId = Strata.defaultProjectId,
		storage: Storage = window.localStorage
	) {
		this.store = new LocalStore(Strata.storageKey(projectId), storage)
		this.vault = this.makeVault()
	}

	makeVault() {
		return new Vault<State>({
			store: this.store,
			prism: this.trunk,
			version: Strata.storageVersion
		})
	}

	save = async() => {
		this.trunk.get().updatedAt = Date.now()
		await this.vault.save()
	}

	listen() {
		this.#stopChanges = this.trunk.on(this.save)
		this.#stopStorage = this.store.onStorageEvent(() => this.vault.load())
	}

	dispose() {
		this.#stopStorage()
		this.#stopChanges()
	}
}

