
import {html} from "lit"

export function ProjectLocalStatus() {
	return html`
		<footer class="local-status">
			<span class="status-dot"></span>
			<span>All projects stored locally</span>
			<i></i>
			<span>342 GB free of 1 TB</span>
		</footer>
	`
}
