import {html} from "@benev/slate"

export const TestEnvAlert = html`
	<sl-alert
		class="test-env-alert"
		variant="warning"
		open
		closable
	>
		<sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
		<strong>Test Environment:</strong> You are currently using a staging/testing version of this site.
	</sl-alert>
`
