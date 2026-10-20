
import {makeEndpoint} from "@e280/renraku"
import {httpListener} from "@e280/renraku/node"
import {fromNodeHeaders} from "better-auth/node"
import type {IncomingMessage, ServerResponse} from "node:http"

import {cleanupApi} from "./cleanup.js"
import type {R2Bucket} from "./bucket.js"
import {auth, authOrigin} from "./auth.js"
import {assistantChatApi} from "./assistant/chat.js"
import {mediaAnalysisApi} from "./assistant/analysis.js"

export function setupApi(bucket: R2Bucket) {
	const serveAssistantChat = assistantChatApi()

	return async(request: IncomingMessage, response: ServerResponse, path: string) => {
		// Block cross-origin requests using session cookies (CSRF).
		if (request.headers.origin !== authOrigin)
			return response.writeHead(403).end("Forbidden origin")
		const session = await auth.api.getSession({headers: fromNodeHeaders(request.headers)})
		if (!session)
			return response.writeHead(401).end("Sign in required")

		if (request.method !== "POST")
			return response.writeHead(405).end("Method not allowed")
		if (path === "/api/session/heartbeat")
			return httpListener(makeEndpoint(cleanupApi(session.user.id)))(request, response)
		if (path === "/api/assistant")
			return await serveAssistantChat(request, response)
		if (path === "/api/analyze")
			return httpListener(makeEndpoint(mediaAnalysisApi(bucket, session.user.id)))(request, response)
		response.writeHead(404).end("Not found")
	}
}

