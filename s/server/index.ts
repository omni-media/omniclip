
import {createServer} from "node:http"
import Renraku from "@e280/renraku"

import {setupHttp} from "./parts/http.js"
import {R2Bucket} from "./parts/bucket.js"
import {mediaAnalysisApi} from "./parts/assistant/analysis.js"
import {assistantChatApi} from "./parts/assistant/chat.js"

const isDev = process.env.NODE_ENV !== "production"
const bucket = new R2Bucket()

const serveHttp = setupHttp(isDev)
const serveAssistantChat = assistantChatApi()
const serveMediaAnalysis = Renraku.makeRequestListener({
	rpc: Renraku.asRpc(async () => mediaAnalysisApi(bucket))
})

createServer((request, response) => {
	if (request.method === "POST" && request.url === "/api/assistant")
		serveAssistantChat(request, response)
	else if (request.method === "POST" && request.url === "/api/analyze")
		serveMediaAnalysis(request, response)
	else
		serveHttp(request, response)
})
	.listen(Number(process.env.PORT ?? 3000), "127.0.0.1")
