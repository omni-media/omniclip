import {useEffect} from "react"
import {httpRemote} from "@e280/renraku"

import type {CleanupApi} from "@omnimedia/omniso/api"

const heartbeatInterval = 60_000
const cleanup = httpRemote<CleanupApi>("/api/session/heartbeat", {timeout: 60_000})

export function useProjectHeartbeat(projectId: string, enabled: boolean) {
	useEffect(() => {
		if (!enabled) return
		const heartbeat = () => cleanup.heartbeat({projectId})

		void heartbeat()
		const interval = setInterval(() => void heartbeat(), heartbeatInterval)
		return () => clearInterval(interval)
	}, [projectId, enabled])
}
