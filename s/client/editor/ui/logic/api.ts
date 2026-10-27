
import {signal} from "@e280/strata"
import {httpRemote} from "@e280/renraku"
import {createAuthClient} from "better-auth/client"
import {stripeClient} from "@better-auth/stripe/client"
import {AssistantChatTransport} from "@assistant-ui/ai-sdk"
import type {AssistantContext} from "@omnimedia/omniso/assistant/types"
import type {BillingApi, CleanupApi, MediaAnalysisApi, ReasoningEffort} from "@omnimedia/omniso/api"

export const authClient = createAuthClient({
	plugins: [stripeClient({subscription: true})],
})
export const $auth = signal(authClient.useSession.get())
export const billingClient = httpRemote<BillingApi>("/api/billing")
export const mediaAnalysisClient = httpRemote<MediaAnalysisApi>("/api/analyze", {timeout: Infinity})
export const cleanupClient = httpRemote<CleanupApi>("/api/cleanup", {timeout: 60_000})

export function createChatTransport(body: () => {context: AssistantContext, reasoningEffort: ReasoningEffort}) {
	return new AssistantChatTransport({api: "/api/assistant", body})
}

export function setupAuth() {
	authClient.useSession.subscribe(state => $auth(state))
}
