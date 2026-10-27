
import {useEffect, useState} from "react"
import {useStore} from "better-auth/react"
import {attemptAsync, ev} from "@e280/stz"
import type {AssistantRuntime} from "@assistant-ui/react"
import type {BillingStatus} from "@omnimedia/omniso/billing"

import {authClient, billingClient} from "../../../api.js"

export function useCloudAccess(runtime: AssistantRuntime) {
	const auth = useStore(authClient.useSession)
	const signedIn = !!auth.data
	const [balance, setBalance] = useState<BillingStatus | null>(null)
	const [billingError, setBillingError] = useState(false)

	useEffect(() => {
		let disposed = false
		setBalance(null)
		setBillingError(false)

		if (!signedIn)
			return

		const refresh = async() => {
			const result = await attemptAsync(() => billingClient.status())
			if (disposed)
				return
			setBillingError(!result.ok)
			if (result.ok)
				setBalance(result.value)
		}
		void refresh()
		let running = runtime.thread.getState().isRunning
		const unsubscribe = runtime.thread.subscribe(() => {
			const next = runtime.thread.getState().isRunning
			if (running && !next)
				void refresh()
			running = next
		})
		const unlisten = ev<"focus">(window, {focus: refresh})
		return () => {
			disposed = true
			unsubscribe()
			unlisten()
		}
	}, [auth.data?.user.id, signedIn, runtime])

	return {auth, signedIn, balance, billingError}
}

