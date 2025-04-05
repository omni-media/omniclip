export class BinaryAccumulator {
	#uints: Uint8Array[] = []
	#size = 0
	#cachedBinary: Uint8Array | null = null

	add_chunk(chunk: Uint8Array) {
		this.#size += chunk.byteLength
		this.#uints.push(chunk)
		this.#cachedBinary = null  // Invalidate cache on new data
	}

	// try to get binary once at the end of something otherwise it will cause some memory leaks
	// in most cases getting size should be enough
	get binary() {
		// Return cached binary if available
		if (this.#cachedBinary) {
			return this.#cachedBinary
		}

		let offset = 0
		const binary = new Uint8Array(this.#size)
		for (const chunk of this.#uints) {
			binary.set(chunk, offset)
			offset += chunk.byteLength
		}

		this.#cachedBinary = binary  // Cache the result
		return binary
	}

	get size() {
		return this.#size
	}

	clear_binary() {
		this.#uints = []
		this.#size = 0
		this.#cachedBinary = null
	}
}
