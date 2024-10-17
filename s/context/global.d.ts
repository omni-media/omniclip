import {filters} from "fabric"

declare module 'fabric' {
  namespace filters {
		interface BaseFilter {
			for?: "filter" | "animation"
		}
  }
}
