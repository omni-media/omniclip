export class BinaryAccumulator {
	#uints: Uint8Array[] = []
	#size = 0

	add_chunk(chunk: Uint8Array) {
		this.#size += chunk.byteLength
		this.#uints.push(chunk)
	}

	get binary() {
		let acc = 0
		const binary = new Uint8Array(this.#size)
		this.#uints.forEach(arr => {
			binary.set(arr, acc)
			acc += arr.length
			//@ts-ignore
			arr = null
		})
		return binary
	}

	clear_binary() {
		this.#uints = []
	}
}
