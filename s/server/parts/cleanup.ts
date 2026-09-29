
import Renraku from "@e280/renraku"

import {R2Bucket} from "./bucket.js"

const heartbeatInterval = 60_000
const leaseTimeout = heartbeatInterval * 5
const startedAt = Date.now()

// Keeps temporary AI-video uploads while editor tabs are active, then deletes them once none remain.
// This state is per process; move it to shared storage if the server is scaled out.
const projects = new Map<string, {lastSeen: number; uploads: Set<string>}>()

export type ProjectSession = {projectId: string}

export const sessionApi = () => ({
	async heartbeat(input: ProjectSession) {
		heartbeat(input.projectId)
	},
})

export type SessionApi = ReturnType<typeof sessionApi>

export function cleanupBucketApi(bucket: R2Bucket) {
	setInterval(() => {
		const uploads = takeInactiveUploads()
		if (uploads.length)
			bucket.deleteMany(uploads)
				.catch(error => console.error("Could not clean temporary uploads", error))
	}, heartbeatInterval)

	return Renraku.makeRequestListener({
		rpc: Renraku.asRpc(async () => sessionApi())
	})
}

function project(projectId: string) {
	const current = projects.get(projectId) ?? {lastSeen: 0, uploads: new Set<string>()}
	projects.set(projectId, current)
	current.lastSeen = Date.now()
	return current
}

export function heartbeat(projectId: string) {
	project(projectId)
}

export function trackTemporaryUpload(projectId: string, fileName: string) {
	project(projectId).uploads.add(fileName)
}

export function takeInactiveUploads() {
	if (Date.now() - startedAt < leaseTimeout) return []

	const cutoff = Date.now() - leaseTimeout
	const fileNames: string[] = []
	for (const [projectId, current] of projects)
		if (current.lastSeen < cutoff) {
			projects.delete(projectId)
			fileNames.push(...current.uploads)
		}

	return fileNames
}

