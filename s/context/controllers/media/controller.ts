import {quick_hash} from "@benev/construct"
import {generate_id, pub} from "@benev/slate"

import {Compositor} from "../compositor/controller.js"
import {TimelineActions} from "../timeline/actions.js"
import {AudioEffect, ImageEffect, VideoEffect, XTimeline} from "../timeline/types.js"
import {find_place_for_new_effect} from "../timeline/utils/find_place_for_new_effect.js"
import {Video, VideoFile, AnyMedia, ImageFile, Image, AudioFile, Audio} from "../../../components/omni-media/types.js"

export class Media {
	#database_request = window.indexedDB.open("database", 3)
	#opened = false
	on_media_change = pub<{files: AnyMedia[], action: "removed" | "added"}>()

	constructor(private actions: TimelineActions) {
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

	async get_imported_files(): Promise<AnyMedia[]> {
		return new Promise(async (resolve, reject) => {
			await this.#is_db_opened()
			const transaction = this.#database_request.result.transaction(["files"])
			const files_handles_store = transaction.objectStore("files")
			const request = files_handles_store.getAll()

			request.onsuccess = async () => {
				try {
					const files: AnyMedia[] = request.result || []
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
			const hash = await quick_hash(imported_file)
			const transaction = this.#database_request.result.transaction(["files"], "readwrite")
			const files_store = transaction.objectStore("files")
			const check_if_duplicate = files_store.count(hash)

			check_if_duplicate!.onsuccess = () => {
				const not_duplicate = check_if_duplicate.result === 0
				if(not_duplicate) {
					if(imported_file.type.startsWith("image")) {
						files_store.add({file: imported_file, hash, kind: "image"})
						this.on_media_change.publish({files: [{file: imported_file, hash, kind: "image"}], action: "added"})
					}
					else if(imported_file.type.startsWith("video")) {
						files_store.add({file: imported_file, hash, kind: "video"})
						this.on_media_change.publish({files: [{file: imported_file, hash, kind: "video"}], action: "added"})
					}
					else if(imported_file.type.startsWith("audio")) {
						files_store.add({file: imported_file, hash, kind: "audio"})
						this.on_media_change.publish({files: [{file: imported_file, hash, kind: "audio"}], action: "added"})
					}
				}
			}
			check_if_duplicate!.onerror = (error) => console.log("error")
		}
	}
	
	add_video_effect(video: Video, compositor: Compositor, timeline: XTimeline) {
		const duration = video.element.duration * 1000
		const adjusted_duration_to_timebase = Math.floor(duration / (1000/timeline.timebase)) * (1000/timeline.timebase)
		const effect: VideoEffect = {
			id: generate_id(),
			kind: "video",
			raw_duration: duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 0,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 0,
			thumbnail: video.thumbnail
		}
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		compositor.VideoManager.add_video(effect, video.file)
		this.actions.add_video_effect(effect)
	}

	add_audio_effect(audio: Audio, compositor: Compositor, timeline: XTimeline) {
		const duration = audio.element.duration * 1000
		const adjusted_duration_to_timebase = Math.floor(duration / (1000/timeline.timebase)) * (1000/timeline.timebase)
		const effect: AudioEffect = {
			id: generate_id(),
			kind: "audio",
			raw_duration: duration,
			duration: adjusted_duration_to_timebase,
			start_at_position: 0,
			start: 0,
			end: adjusted_duration_to_timebase,
			track: 2,
		}
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		compositor.AudioManager.add_video(effect, audio.file)
		this.actions.add_audio_effect(effect)
	}

	add_image_effect(image: Image, compositor: Compositor, timeline: XTimeline) {
		const effect: ImageEffect = {
			id: generate_id(),
			kind: "image",
			duration: 1000,
			start_at_position: 0,
			start: 0,
			end: 1000,
			track: 2,
			url: image.url
		}
		const {position, track} = find_place_for_new_effect(timeline.effects, timeline.tracks)
		effect.start_at_position = position!
		effect.track = track
		compositor.ImageManager.add_image(effect, image.file)
		this.actions.add_image_effect(effect)
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

	async create_videos_from_video_files(files: VideoFile[]) {
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
