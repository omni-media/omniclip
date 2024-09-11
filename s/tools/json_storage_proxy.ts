type JsonStorageProxy<R> = {
	[key: string]: any
} & R

export function json_storage_proxy<R extends Record<string, any>>(storage: Storage, prefix = "") {
	return new Proxy({} as JsonStorageProxy<R>, {
		get(_, key: string) {
			const fullKey = `${prefix}${key}`
			const json = storage.getItem(fullKey)
			try {
				return json ? JSON.parse(json) : undefined
			} catch (error) {
				return undefined
			}
		},
		set(_, key: string, value: any) {
			const fullKey = `${prefix}${key}`
			try {
				const json = JSON.stringify(value)
				storage.setItem(fullKey, json)
				return true
			} catch (error) {
				return false
			}
		},
		deleteProperty(_, key: string) {
			const fullKey = `${prefix}${key}`
			storage.removeItem(fullKey)
			return true;
		}
	}) as JsonStorageProxy<R>
}
