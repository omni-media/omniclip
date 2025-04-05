export class FileSystemHelper {

	async writeFile(fileHandle: FileSystemFileHandle, contents: Uint8Array) {
		// Support for Chrome 82 and earlier.
			//@ts-ignore
		if (fileHandle.createWriter) {
			//@ts-ignore
			const writer = await fileHandle.createWriter()
			await writer.write(0, contents)
			await writer.close()
			return
		}
		// For Chrome 83 and later.
		const writable = await fileHandle.createWritable()
		await writable.write(contents)
		await writable.close()
	}


	readFile(file: File) {
		if (file.text) {
			return file.text()
		}
		return this.#readFileLegacy(file)
	}

	async getFileHandle() {
		// For Chrome 86 and later...
		if ('showSaveFilePicker' in window) {
			const handle = await self.showSaveFilePicker({
				suggestedName: 'test.mp4',
				types: [{
					description: 'mp4 video',
					accept: {
						'video/mp4': ['.mp4'],
					},
				}],
			})

			return handle
		}
		//@ts-ignore
		return window.chooseFileSystemEntries()
	}

	getNewFileHandle() {
		// For Chrome 86 and later...
		if ('showSaveFilePicker' in window) {
			const opts: SaveFilePickerOptions = {
				types: [{
					description: 'Text file',
					accept: {'text/plain': ['.txt']},
				}],
			}
			return window.showSaveFilePicker(opts)
		}
		// For Chrome 85 and earlier...
		const opts = {
			type: 'save-file',
			accepts: [{
				description: 'Text file',
				extensions: ['txt'],
				mimeTypes: ['text/plain'],
			}],
		}
		//@ts-ignore
		return window.chooseFileSystemEntries(opts)
	}

	async verifyPermission(fileHandle: FileSystemFileHandle, withWrite: boolean) {
		const opts: FileSystemHandlePermissionDescriptor = {
			mode: undefined,
			writable: false
		}
		if (withWrite) {
			opts.writable = true;
			// For Chrome 86 and later...
			opts.mode = 'readwrite'
		}
		if (await fileHandle.queryPermission(opts) === 'granted') {
			return true
		}
		if (await fileHandle.requestPermission(opts) === 'granted') {
			return true
		}
		return false
	}

	#readFileLegacy(file: File) {
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.addEventListener('loadend', (e) => {
			//@ts-ignore
				const text = e.srcElement.result
				resolve(text)
			})
			reader.readAsText(file)
		})
	}
}
