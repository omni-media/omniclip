import {HistoricalState} from "../../types.js"
import {json_storage_proxy} from "../../../tools/json_storage_proxy.js"

export type Store = Partial<HistoricalState>

export function store(storage: Storage) {
	return json_storage_proxy<Store>(storage, "omniclip_")
}
