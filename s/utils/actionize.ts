import {ZipAction} from "@benev/slate/x/watch/zip/action.js"

import {OmniState, OmniStateHistorical, OmniStateNonHistorical} from "../types.js"

export const actionize_historical = ZipAction.blueprint<OmniStateHistorical>()
export const actionize_non_historical = ZipAction.blueprint<OmniStateNonHistorical>()
export const actionize = ZipAction.blueprint<OmniState>()
