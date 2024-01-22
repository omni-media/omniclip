import {quick_hash} from "@benev/construct"

import {ImportedFile} from "../../../components/omni-media/types"

export class Media {

	async get_imported_files(database: IDBDatabase): Promise<ImportedFile[]> {
		return new Promise((resolve, reject) => {
			const transaction = database.transaction(["files"])
			const files_handles_store = transaction.objectStore("files")
			const request = files_handles_store.getAll()

			request.onsuccess = async () => {
				try {
					const files: ImportedFile[] = request.result || []
					resolve(files)
				} catch (error) {
					reject(error)
				}
			}

			request.onerror = () => {
				reject(new Error("Failed to retrieve files from the database"));
			}
		})
	}

	async get_file_handle() {
		const [file_handle] = await window.showOpenFilePicker()
		return file_handle
	}

	delete_file(database: IDBDatabase, file_hash: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const request = database
				.transaction(["files"], "readwrite")
				.objectStore("files")
				.delete(file_hash)
			request.onsuccess = (event) => resolve(true)
		})
	}

	import_file(database: IDBDatabase): Promise<ImportedFile> {
		return new Promise((resolve, reject) => {
			const file_handle = this.get_file_handle()

			file_handle.then(async (handle) => {

				const imported_file = await handle.getFile()
				const hash = await quick_hash(imported_file)
				const transaction = database.transaction(["files"], "readwrite")
				const files_store = transaction.objectStore("files")
				const check_if_duplicate = files_store.count(hash)

				check_if_duplicate!.onsuccess = () => {
					const not_duplicate = check_if_duplicate.result === 0
					if(not_duplicate) {
						files_store.add({file: imported_file, hash})
						resolve({content: imported_file, hash})
					}
				}

				check_if_duplicate!.onerror = (error) => reject(error)

			})
		})
	}

	create_videos_from_video_files(imported_files: ImportedFile[]) {
		const videos: {media: HTMLVideoElement, file: ImportedFile}[] = []
		for(const imported_file of imported_files) {
			const video = document.createElement('video')
			video.src = URL.createObjectURL(imported_file.content)
			video.load()
			videos.push({media: video, file: imported_file})
		}
		return videos
	}

}
