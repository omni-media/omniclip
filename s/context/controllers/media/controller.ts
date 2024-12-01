import {pub} from "@benev/slate"
import {quick_hash} from "@benev/construct"
import type { ReadChunkFunc, VideoTrack, MediaInfo } from 'mediainfo.js'
//@ts-ignore
import {mediaInfoFactory} from 'mediainfo.js/dist/esm-bundle/index.min.js'

import {Actions} from "../../actions.js"
import {Video, VideoFile, AnyMedia, ImageFile, Image, AudioFile, Audio} from "../../../components/omni-media/types.js"

function makeReadChunk(file: File): ReadChunkFunc {
	return async (chunkSize: number, offset: number) =>
		new Uint8Array(await file.slice(offset, offset + chunkSize).arrayBuffer())
}

async function getMediaInfo() {
	return await new mediaInfoFactory({
		locateFile: () => `${window.location.origin}/assets/MediaInfoModule.wasm` // Path to the wasm file
	})
}

const mediainfo = await getMediaInfo() as MediaInfo

export class Media extends Map<string, AnyMedia> {
	#database_request = window.indexedDB.open("database", 3)
	#opened = false
	#files_ready = false
	on_media_change = pub<{files: AnyMedia[], action: "removed" | "added" | "placeholder"}>()

	constructor(private actions: Actions) {
		super()
		this.#get_imported_files()
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
			this.#opened = true
		}
	}

	#is_db_opened() {
		return new Promise((resolve) => {
			if(this.#opened) {
				resolve(true)
			} else {
				const interval = setInterval(() => {
					if(this.#opened) {
						resolve(true)
						clearInterval(interval)
					}
				}, 100)
			}
		})
	}

	are_files_ready() {
		return new Promise((resolve) => {
			if(this.#files_ready) {
				resolve(true)
			} else {
				const interval = setInterval(() => {
					if(this.#files_ready) {
						resolve(true)
						clearInterval(interval)
					}
				}, 100)
			}
		})
	}

	async get_file(file_hash: string) {
		await this.are_files_ready()
		return this.get(file_hash)?.file
	}

	async getImportedFiles(): Promise<AnyMedia[]> {
		return new Promise(async (resolve) => {
			await this.are_files_ready()
			resolve([...this.values()])
		})
	}

	async #get_imported_files(): Promise<AnyMedia[]> {
		return new Promise(async (resolve, reject) => {
			await this.#is_db_opened()
			const transaction = this.#database_request.result.transaction(["files"])
			const files_handles_store = transaction.objectStore("files")
			const request = files_handles_store.getAll()

			request.onsuccess = async () => {
				try {
					const files: AnyMedia[] = request.result || []
					for(const file of files) {
						this.set(file.hash, file)
					}
					this.#files_ready = true
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

	delete_file(file: AnyMedia) {
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
                    await this.import_from_file(imported_file);
		}
	}
        
        async import_from_file(file: File) {
            this.#files_ready = false
            this.on_media_change.publish({files: [], action: "placeholder"})
            const video_info = file?.type.startsWith('video')
                    ? await mediainfo.analyzeData(
                                    file.size,
                                    makeReadChunk(file)
                            )
                    : null
            if(file) {
                    const hash = await quick_hash(file)
                    const transaction = this.#database_request.result.transaction(["files"], "readwrite")
                    const files_store = transaction.objectStore("files")
                    const check_if_duplicate = files_store.count(hash)
                    check_if_duplicate!.onsuccess = () => {
                            const not_duplicate = check_if_duplicate.result === 0
                            if(not_duplicate) {
                                    if(file.type.startsWith("image")) {
                                            const media = {file: file, hash, kind: "image"} satisfies AnyMedia
                                            files_store.add(media)
                                            this.set(hash, media)
                                            this.on_media_change.publish({files: [media], action: "added"})
                                    }
                                    else if(file.type.startsWith("video")) {
                                            const track = video_info!.media?.track[0] as VideoTrack
                                            const duration = track?.Duration! * 1000
                                            const frames = track.FrameCount!
                                            const media = {file: file, hash, kind: "video", frames, duration} satisfies AnyMedia
                                            files_store.add(media)
                                            this.set(hash, media)
                                            this.on_media_change.publish({files: [media], action: "added"})
                                    }
                                    else if(file.type.startsWith("audio")) {
                                            const media = {file: file, hash, kind: "audio"} satisfies AnyMedia
                                            files_store.add(media)
                                            this.set(hash, media)
                                            this.on_media_change.publish({files: [media], action: "added"})
                                    }
                            }
                            this.#files_ready = true
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

	create_image_elements(files: ImageFile[]) {
		const images: Image[] = files.map(({file, hash}) => {
			const image = document.createElement("img")
			const url = URL.createObjectURL(file)
			image.src = url
			return {element: image, file, hash, kind: "image", url}
		})
		return images
	}

	create_audio_elements(files: AudioFile[]) {
		const audios: Audio[] = files.map(({file, hash}) => {
			const audio = document.createElement("audio")
			const url = URL.createObjectURL(file)
			audio.src = url
			audio.load()
			return {element: audio, file, hash, kind: "audio", url}
		})
		return audios
	}

	async create_video_elements(files: VideoFile[]) {
		const videos: Video[] = []
		for(const {file, hash, frames, duration} of files) {
			const video = document.createElement('video')
			video.src = URL.createObjectURL(file)
			video.load()
			const url = await this.create_video_thumbnail(video)
			videos.push({element: video, file, hash, kind: "video", thumbnail: url, frames, duration})
		}
		return videos
	}

}
