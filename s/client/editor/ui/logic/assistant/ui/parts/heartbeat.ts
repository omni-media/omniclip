import {useEffect} from "react"
import {cleanupClient} from "../../../api.js"

const heartbeatInterval = 60_000

export function useProjectHeartbeat(projectId: string, enabled: boolean) {
	useEffect(() => {
		if (!enabled) return
		const heartbeat = () => cleanupClient.heartbeat({projectId}).catch(() => {})

		void heartbeat()
		const interval = setInterval(() => void heartbeat(), heartbeatInterval)
		return () => clearInterval(interval)
	}, [projectId, enabled])
}
