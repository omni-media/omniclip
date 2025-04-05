export function removeDuplicatesByKey<T>(arr: T[], keyName: keyof T): T[] {
	const uniqueByName = new Map()

	arr.forEach((item) => {
		if (!uniqueByName.has(item[keyName])) {
			uniqueByName.set(item[keyName], item)
		}
	})

	return Array.from(uniqueByName.values())
}
