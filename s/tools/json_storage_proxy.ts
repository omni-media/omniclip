import {Pojo} from "@benev/slate"

export function json_storage_proxy<R extends Pojo<any>>(storage: Storage, prefix = "") {
	return new Proxy({}, {
		get(_, key: string) {
			const json = storage.getItem(prefix + key)
			try {
				return json
					? JSON.parse(json)
					: undefined
			}
			catch (error) {
				return undefined
			}
		},
		set(_, key: string, value: any) {
			const json = JSON.stringify(value)
			storage.setItem(prefix + key, json)
			return true
		}
	}) as Partial<R>
}
