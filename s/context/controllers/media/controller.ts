import {pub} from "@benev/slate"
import {quick_hash} from "@benev/construct"

import {Video, MediaFile} from "../../../components/omni-media/types.js"

export class Media {
	#database_request = window.indexedDB.open("database", 3)

	on_media_change = pub<{files: MediaFile[], action: "removed" | "added"}>()

	constructor() {
		this.#database_request.onerror = (event) => {
			console.error("Why didn't you allow my web app to use IndexedDB?!")
		}
		this.#database_request.onsuccess = (event) => {
			console.log("success")
		}
		this.#database_request.onupgradeneeded = (event) => {
			const database = (event.target as IDBRequest).result as IDBDatabase
			const objectStore = database.createObjectStore("files", {keyPath: "hash"})
			objectStore!.createIndex("file", "file", { unique: true })
			objectStore!.transaction.oncomplete = (event) => {
				console.log("complete")
			}
		}
		this.#database_request.onsuccess = async (e) => {
			const target = e.target as IDBRequest
			const database = target.result as IDBDatabase
			const imported_files = await this.#get_imported_files(database)
			this.on_media_change.publish({files: imported_files, action: "added"})
		}
	}

	async #get_imported_files(database: IDBDatabase): Promise<MediaFile[]> {
		return new Promise((resolve, reject) => {
			const transaction = database.transaction(["files"])
			const files_handles_store = transaction.objectStore("files")
			const request = files_handles_store.getAll()

			request.onsuccess = async () => {
				try {
					const files: MediaFile[] = request.result || []
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

	delete_file(file: MediaFile) {
		const request = this.#database_request.result
			.transaction(["files"], "readwrite")
			.objectStore("files")
			.delete(file.hash)
		request.onsuccess = (event) => {
			this.on_media_change.publish({files: [file], action: "removed"})
		}
	}

	async import_file(input: HTMLInputElement) {
		const imported_file = input.files?.[0]
		if(imported_file) {
			const hash = await quick_hash(imported_file)
			const transaction = this.#database_request.result.transaction(["files"], "readwrite")
			const files_store = transaction.objectStore("files")
			const check_if_duplicate = files_store.count(hash)

			check_if_duplicate!.onsuccess = () => {
				const not_duplicate = check_if_duplicate.result === 0
				if(not_duplicate) {
					files_store.add({file: imported_file, hash})
					this.on_media_change.publish({files: [{file: imported_file, hash}], action: "added"})
				}
			}
			check_if_duplicate!.onerror = (error) => console.log("error")
		}
	}
	
	create_video_thumbnail(video: HTMLVideoElement): Promise<string> {
		const canvas = document.createElement("canvas")
		canvas.width = 150
		canvas.height = 50
		const ctx = canvas.getContext("2d")
		video.currentTime = 1000/60
		const f = (resolve: (url: string) => void) => {
			ctx?.drawImage(video, 0, 0, 150, 50)
			const url = canvas.toDataURL()
			resolve(url)
			removeEventListener("seeked", () => f(resolve))
		}
		return new Promise((resolve) => {
			video.addEventListener("seeked", () => f(resolve))
		})
	}

	async create_videos_from_video_files(files: MediaFile[]) {
		const videos: Video[] = []
		for(const {file, hash} of files) {
			const video = document.createElement('video')
			video.src = URL.createObjectURL(file)
			video.load()
			const url = await this.create_video_thumbnail(video)
			videos.push({element: video, file, hash, kind: "video", thumbnail: url})
		}
		return videos
	}

}
