
import {useSignal} from "@e280/sly"
import {attemptAsync} from "@e280/stz"
import {billing} from "@omnimedia/omniso/billing"

import {authClient, billingClient} from "../../logic/api.js"

export type BillingAction = "subscribe" | "manage" | "credits"

export function useAccountActions(signedIn: boolean) {
	const busy = useSignal(false)
	const error = useSignal("")
	const returnUrl = `${location.origin}/editor/#/account`

	const runAction = async(action: () => Promise<void>, failure: string) => {
		busy(true)
		error("")
		const result = await attemptAsync(action)
		if (!result.ok) error(failure)
		busy(false)
	}

	const manageBilling = (action: BillingAction) => runAction(async() => {
		if (action === "credits") {
			location.assign((await billingClient.buyCredits()).url)
			return
		}
		const result = action === "subscribe"
			? await authClient.subscription.upgrade({plan: billing.plan, successUrl: returnUrl, cancelUrl: returnUrl})
			: await authClient.subscription.billingPortal({returnUrl})
		if (result.error) error(result.error.message ?? "Could not open billing.")
	}, "Could not open billing. Please try again.")

	const submit = () => runAction(async() => {
		const result = signedIn
			? await authClient.signOut()
			: await authClient.signIn.social({
				provider: "google",
				callbackURL: `${location.origin}${location.pathname}${location.hash}`,
				errorCallbackURL: `${location.origin}/editor/#/account`,
			})
		if (result.error) error(result.error.message ?? "Sign-in failed. Please try again.")
	}, "Could not reach the server. Please try again.")

	return {busy, error, manageBilling, submit}
}
