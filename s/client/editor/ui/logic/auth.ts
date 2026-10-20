
import {signal} from "@e280/strata"
import {createAuthClient} from "better-auth/client"

export const authClient = createAuthClient()
export const $auth = signal(authClient.useSession.get())

export function setupAuth() {
	authClient.useSession.subscribe(state => $auth(state))
}

