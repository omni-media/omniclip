import {pub} from "@benev/slate"
import {quick_hash} from "@benev/construct"
import type {ReadChunkFunc, MediaInfo} from 'mediainfo.js'
//@ts-ignore
import {mediaInfoFactory} from 'https://cdn.jsdelivr.net/npm/mediainfo.js@0.3.2/+esm'

import {Video, VideoFile, AnyMedia, ImageFile, Image, AudioFile, Audio} from "../../../components/omni-media/types.js"

export function makeReadChunk(file: File): ReadChunkFunc {
	return async (chunkSize: number, offset: number) =>
		new Uint8Array(await file.slice(offset, offset + chunkSize).arrayBuffer())
}

// its best to create new instance of mediainfo every time its used
export async function getMediaInfo() {
	return await new mediaInfoFactory({
		locateFile: () => `${window.location.origin}/assets/MediaInfoModule.wasm` // Path to the wasm file
	})
}

export class Media extends Map<string, AnyMedia> {
	#database_request = window.indexedDB.open("database", 3)
	#opened = false
	#files_ready = false
	on_media_change = pub<{files: AnyMedia[], action: "removed" | "added" | "placeholder"}>()

	constructor() {
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

	async delete_file(hash: string) {
		const media = this.get(hash)
		return new Promise((resolve) => {
			const request = this.#database_request.result
				.transaction(["files"], "readwrite")
				.objectStore("files")
				.delete(hash)
			request.onsuccess = (event) => {
				resolve(true)
				this.on_media_change.publish({files: [media!], action: "removed"})
			}
		})
	}

	async getVideoFileMetadata(file: File) {
		const info = await getMediaInfo() as MediaInfo
		const metadata = await info.analyzeData(
			file.size,
			makeReadChunk(file)
		)
		const videoTrack = metadata.media?.track.find(track => track["@type"] === "Video")
		if(videoTrack?.["@type"] === "Video") {
			const duration = videoTrack.Source_Duration ? videoTrack.Source_Duration * 1000 : videoTrack.Duration! * 1000
			const frames = Math.round(videoTrack.FrameRate! * (videoTrack.Source_Duration ?? videoTrack.Duration!))
			const fps = videoTrack.FrameRate!
			const width = videoTrack.Sampled_Width
			const height = videoTrack.Sampled_Height
			return {fps, duration, frames, width, height}
		} else {
			throw Error("File is not a video")
		}
	}

	// syncing files for collaboration (no permament storing to db)
	async syncFile(file: File, hash: string, proxy?: boolean, isHost?: boolean) {
		const alreadyAdded = this.get(hash)
		if(alreadyAdded && proxy) {return}
		if(file.type.startsWith("image")) {
			const media = {file, hash, kind: "image"} satisfies AnyMedia
			this.set(hash, media)
			if(isHost) {
				this.import_file(file, hash, proxy)
			} else this.on_media_change.publish({files: [media], action: "added"})
		}
		else if(file.type.startsWith("video")) {
			const {frames, duration, fps} = await this.getVideoFileMetadata(file)
			const media = {file, hash, kind: "video", frames, duration, fps, proxy: proxy ?? false} satisfies AnyMedia
			this.set(hash, media)
			if(isHost) {
				this.import_file(file, hash, proxy)
			} else this.on_media_change.publish({files: [media], action: "added"})
		}
		else if(file.type.startsWith("audio")) {
			const media = {file, hash, kind: "audio"} satisfies AnyMedia
			this.set(hash, media)
			if(isHost) {
				this.import_file(file, hash, proxy)
			} else this.on_media_change.publish({files: [media], action: "added"})
		}
	}

	async import_file(input: HTMLInputElement | File, proxyHash?: string, isProxy?: boolean) {
		this.#files_ready = false
		this.on_media_change.publish({files: [], action: "placeholder"})
		const imported_file = input instanceof File ? input : input.files?.[0]
		const metadata = imported_file?.type.startsWith('video')
			? await this.getVideoFileMetadata(imported_file)
			: null
		if(imported_file) {
			const hash = proxyHash ?? await quick_hash(imported_file)
			if(isProxy === false && proxyHash) {await this.delete_file(proxyHash)}
			const transaction = this.#database_request.result.transaction(["files"], "readwrite")
			const files_store = transaction.objectStore("files")
			const check_if_duplicate = files_store.count(hash)
			check_if_duplicate!.onsuccess = () => {
				const not_duplicate = check_if_duplicate.result === 0
				if(not_duplicate) {
					if(imported_file.type.startsWith("image")) {
						const media = {file: imported_file, hash, kind: "image"} satisfies AnyMedia
						files_store.add(media)
						this.set(hash, media)
						this.on_media_change.publish({files: [media], action: "added"})
					}
					else if(imported_file.type.startsWith("video")) {
						const {frames, duration, fps} = metadata!
						const media = {file: imported_file, hash, kind: "video", frames, duration, fps, proxy: isProxy ?? false} satisfies AnyMedia
						files_store.add(media)
						this.set(hash, media)
						this.on_media_change.publish({files: [media], action: "added"})
					}
					else if(imported_file.type.startsWith("audio")) {
						const media = {file: imported_file, hash, kind: "audio"} satisfies AnyMedia
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
		for(const {file, hash, frames, duration, fps, proxy} of files) {
			const video = document.createElement('video')
			video.src = URL.createObjectURL(file)
			video.load()
			const thumbnail = await this.create_video_thumbnail(video)
			videos.push({element: video, file, hash, kind: "video", thumbnail, frames, duration, fps, proxy})
		}
		return videos
	}

}
