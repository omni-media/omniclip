
import {html} from "lit"
import {shadow, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import {renderBilling} from "./billing.js"
import {useCloudAccess} from "./access.js"
import themeCss from "../../../theme.css.js"
import {useAccountActions} from "./actions.js"

export const AccountPage = shadow(() => {
	useName("account")
	useCss(themeCss, styleCss)

	const {auth: state, billing} = useCloudAccess()
	const user = state.data?.user
	const {busy, error, manageBilling, submit} = useAccountActions(!!user)
	const oauthError = new URLSearchParams(location.search).has("error")

	const renderSession = () => {
		if (state.isPending)
			return html`<p role="status">Checking your session…</p>`

		if (user) return html`
			<section class="identity" aria-label="Signed-in account">
				<div><p class="eyebrow">Signed in as</p><p class="email">${user.email}</p></div>
				<button class="quiet" type="button" ?disabled=${busy()} @click=${submit}>Sign out</button>
			</section>
		`
		return html`
			<p>Continue with Google to use cloud AI.</p>
			<button class="primary" type="button" ?disabled=${busy()} @click=${submit}>
				${busy() ? "Please wait…" : "Continue with Google"}
			</button>
			<p class="free-note">Editing, exports, and local MCP are always free.</p>
		`
	}

	const message = error()
		|| (billing.error && "Could not load your subscription. Please refresh to retry.")
		|| (state.error && "Could not check your session. Please refresh to retry.")
		|| (oauthError && "Google sign-in was not completed. Please try again.")

	return html`
		<main>
			<div class="account-page">
				<header class="page-heading">
					<a href="#/projects">← Back to projects</a>
					<h1>${user ? "Your account" : "Sign in to Omniclip"}</h1>
				</header>
				${renderSession()}
				${user ? renderBilling({billing, busy: busy(), manageBilling}) : null}
				${message ? html`<p class="error" role="alert">${message}</p>` : null}
				<p class="note">Projects and media stay in this browser. Signing in does not upload them.</p>
			</div>
		</main>
	`
})

