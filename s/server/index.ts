
import {createServer} from "node:http"

import {Hub} from "./hub.js"
import {setupHttp} from "./parts/http.js"
import {setupAssistantApi} from "./parts/assistant.js"

const isDev = process.env.NODE_ENV !== "production"
const hub = new Hub()
const serveHttp = setupHttp(isDev)
const serveAssistant = setupAssistantApi(hub)

createServer((request, response) => {
	if (request.method === "POST" && request.url === "/api/assistant")
		serveAssistant(request, response)
	else
		serveHttp(request, response)
})
	.listen(Number(process.env.PORT ?? 3000), "127.0.0.1")
