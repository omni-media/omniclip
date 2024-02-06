export class BinaryAccumulator {
	#bytes: number[] = []

	addChunk(chunk: Uint8Array) {
		for (const byte of chunk)
			this.#bytes.push(byte)
	}

	get binary() {
		return new Uint8Array(this.#bytes)
	}

	clear_binary() {
		this.#bytes = []
	}
}
