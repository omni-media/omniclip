
import {createServer} from "node:http"
import {toNodeHandler} from "better-auth/node"

import {setupApi} from "./parts/api.js"
import {setupHttp} from "./parts/http.js"
import {R2Bucket} from "./parts/bucket.js"
import {auth, authOrigin} from "./parts/auth.js"
import {startBucketCleanup} from "./parts/cleanup.js"

const isDev = process.env.NODE_ENV !== "production"
const bucket = new R2Bucket()
const serveHttp = setupHttp(isDev)
const serveApi = setupApi(bucket)
const serveAuth = toNodeHandler(auth)
startBucketCleanup(bucket)

createServer(async(request, response) => {
	try {
		const path = new URL(request.url!, authOrigin).pathname
		if (path.startsWith("/api/auth/"))
			return await serveAuth(request, response)
		if (!path.startsWith("/api/"))
			return serveHttp(request, response)

		return await serveApi(request, response, path)
	}
	catch (error) {
		console.error("Request failed", error)
		if (response.headersSent) response.destroy()
		else response.writeHead(500).end("Request failed")
	}
})
	.listen(Number(process.env.PORT ?? 3000), "127.0.0.1")

