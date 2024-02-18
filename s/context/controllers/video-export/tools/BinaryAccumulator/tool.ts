export class BinaryAccumulator {
	#bytes: number[] = []

	addChunk(chunk: Uint8Array) {
		for(let i = 0; i <= chunk.length; i++) {
			this.#bytes.push(chunk[i])
		}
	}

	get binary() {
		return new Uint8Array(this.#bytes)
	}

	clear_binary() {
		this.#bytes = []
	}
}
