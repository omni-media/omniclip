import {ZipAction} from "@benev/slate/x/watch/zip/action.js"

import {State, HistoricalState,NonHistoricalState} from "../context/types.js"

export const actionize_historical = ZipAction.blueprint<HistoricalState>()
export const actionize_non_historical = ZipAction.blueprint<NonHistoricalState>()
export const actionize = ZipAction.blueprint<State>()
