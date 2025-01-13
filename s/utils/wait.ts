export function wait(seconds: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true)
		}, seconds * 1000)
	})
}
