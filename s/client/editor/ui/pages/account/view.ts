
import {html} from "lit"
import {shadow, useCss, useName, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"
import {$auth, authClient} from "../../logic/auth.js"

export const AccountPage = shadow(() => {
	useName("account")
	useCss(themeCss, styleCss)
	const busy = useSignal(false)
	const error = useSignal("")
	const state = $auth()
	const user = state.data?.user
	const oauthError = new URLSearchParams(location.search).has("error")

	const submit = async() => {
		busy(true)
		error("")
		try {
			const result = user
				? await authClient.signOut()
				: await authClient.signIn.social({
					provider: "google",
					callbackURL: `${location.origin}${location.pathname}${location.hash}`,
					errorCallbackURL: `${location.origin}/editor/#/account`,
				})
			if (result.error) error(result.error.message ?? "Sign-in failed. Please try again.")
		}
		catch {
			error("Could not reach the server. Please try again.")
		}
		finally {
			busy(false)
		}
	}

	const renderSession = () => {
		if (state.isPending)
			return html`<p role="status">Checking your session…</p>`

		const action = user ? "Sign out" : "Continue with Google"
		return html`
			<p>${user ? user.email : "Continue with Google to use cloud AI."}</p>
			<button type="button" ?disabled=${busy()} @click=${submit}>
				${busy() ? "Please wait…" : action}
			</button>
			${user ? html`<a href="#/projects">Open projects</a>` : null}
		`
	}

	const renderError = () => {
		let message = error()
		if (!message && state.error)
			message = "Could not check your session. Please refresh to retry."
		if (!message && oauthError)
			message = "Google sign-in was not completed. Please try again."

		return message ? html`<p class="error" role="alert">${message}</p>` : null
	}

	return html`
		<header theme=topper></header>
		<main>
			<section class="account-card">
				<h1>${user ? "Your account" : "Sign in to Omniclip"}</h1>
				${renderSession()}
				${renderError()}
				<p class="note">Projects and media stay in this browser. Signing in does not upload them.</p>
			</section>
		</main>
	`
})

