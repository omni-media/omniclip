export function compare_arrays<T>(originalArray: T[], newArray: T[]) {
	const add: T[] = []
	const remove: T[] = []

	for (const item of newArray) {
		if (!originalArray.includes(item)) {
			add.push(item)
		}
	}
	for (const item of originalArray) {
		if (!newArray.includes(item)) {
			remove.push(item)
		}
	}

	return {add, remove}
}
