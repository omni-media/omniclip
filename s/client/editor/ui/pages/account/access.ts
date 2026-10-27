
import {attemptAsync, ev} from "@e280/stz"
import type {BillingApi} from "@omnimedia/omniso/api"
import {useEffect, useMount, useSignal} from "@e280/sly"
import type {BillingStatus} from "@omnimedia/omniso/billing"

import {$auth, billingClient} from "../../logic/api.js"

export type Pricing = Awaited<ReturnType<BillingApi["pricing"]>>

export function useCloudAccess() {
	const pricing = useSignal<Pricing | null>(null)
	const balance = useSignal<BillingStatus | null>(null)
	const billingError = useSignal(false)

	const refresh = async() => {
		const userId = $auth().data?.user.id
		if (!userId) {
			balance(null)
			billingError(false)
			return
		}
		const result = await attemptAsync(() => billingClient.status())
		if ($auth().data?.user.id !== userId) return
		billingError(!result.ok)
		if (result.ok) balance(result.value)
	}

	useEffect(() => {void refresh()})
	useEffect(() => {
		if ($auth().data?.user)
			void billingClient.pricing().then(pricing).catch(() => pricing(null))
		else
			pricing(null)
	})
	useMount(() => ev<"focus">(window, {focus: refresh}))

	const auth = $auth()
	return {
		auth,
		signedIn: !!auth.data,
		billing: {status: balance(), prices: pricing(), error: billingError()},
	}
}

export type BillingData = ReturnType<typeof useCloudAccess>["billing"]
