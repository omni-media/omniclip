import {TimelineHistorical, TimelineNonHistorical} from "./context/controllers/timeline/types.js"

export interface OmniStateHistorical {
	timeline: TimelineHistorical
}

export interface OmniStateNonHistorical {
	timeline: TimelineNonHistorical
}

export type OmniState = OmniStateHistorical & OmniStateNonHistorical
