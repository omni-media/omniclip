import {useEffect} from "react"
import Renraku from "@e280/renraku"

import type {SessionApi} from "../../../../../../server/parts/cleanup.js"

const heartbeatInterval = 60_000
const session = Renraku.httpRemote<SessionApi>({url: "/api/session/heartbeat"})

export function useProjectHeartbeat(projectId: string) {
	useEffect(() => {
		const heartbeat = () => session.heartbeat({projectId})

		void heartbeat()
		const interval = setInterval(() => void heartbeat(), heartbeatInterval)
		return () => clearInterval(interval)
	}, [projectId])
}
