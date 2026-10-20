
import {ExposedError} from "@e280/renraku"

import {R2Bucket} from "./bucket.js"
import {projectSession, type ProjectSession} from "../../iso/schemas/session.js"

const heartbeatInterval = 60_000
const leaseTimeout = heartbeatInterval * 5
const startedAt = Date.now()

// Keeps temporary AI-video uploads while editor tabs are active, then deletes them once none remain.
// This state is per process; move it to shared storage if the server is scaled out.
const projects = new Map<string, {lastSeen: number; uploads: Set<string>}>()

export const cleanupApi = (userId: string) => ({
	async heartbeat(input: ProjectSession) {
		const result = projectSession.safeParse(input)
		if (!result.success)
			throw new ExposedError("Invalid project session")
		heartbeat(`${userId}/${result.data.projectId}`)
	},
})

export type CleanupApi = ReturnType<typeof cleanupApi>

export function startBucketCleanup(bucket: R2Bucket) {
	setInterval(() => {
		const uploads = takeInactiveUploads()
		if (uploads.length)
			bucket.deleteMany(uploads)
				.catch(error => console.error("Could not clean temporary uploads", error))
	}, heartbeatInterval).unref()
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

export function trackTemporaryUpload(projectId: string, key: string) {
	project(projectId).uploads.add(key)
}

export function takeInactiveUploads() {
	if (Date.now() - startedAt < leaseTimeout) return []

	const cutoff = Date.now() - leaseTimeout
	const keys: string[] = []
	for (const [projectId, current] of projects)
		if (current.lastSeen < cutoff) {
			projects.delete(projectId)
			keys.push(...current.uploads)
		}

	return keys
}

