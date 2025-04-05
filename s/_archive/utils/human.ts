export const human = {
	bytes(bytes: number): string {
			if (bytes < 1e3)
					return `${bytes} B`

			if (bytes < 1e6)
					return `${(bytes / 1e3).toFixed(2)} KB`

			if (bytes < 1e9)
					return `${(bytes / 1e6).toFixed(2)} MB`

			if (bytes < 1e12)
					return `${(bytes / 1e9).toFixed(2)} GB`

			return `${(bytes / 1e12).toFixed(2)} TB`
	},
}
