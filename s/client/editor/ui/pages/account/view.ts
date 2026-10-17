
import {html} from "lit"
import {shadow, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../../../theme.css.js"

export const AccountPage = shadow(() => {
	useName("account")
	useCss(themeCss, styleCss)

	return html`
		<header theme=topper></header>

		<div theme=paddy>
			<h1>Account</h1>
			<p>User account settings will be here.</p>
		<div>
	`
})
