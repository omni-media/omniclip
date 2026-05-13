
import {html} from 'lit'

export function ProjectActionCard(
	tone: string,
	icon: unknown,
	title: string,
	subtitle: string,
	onClick?: () => void
) {
	return html`
		<button class="action-card ${tone}" @click=${onClick}>
			<span class="action-icon">${icon}</span>
			<span>
				<strong>${title}</strong>
				<small>${subtitle}</small>
			</span>
		</button>
	`
}
