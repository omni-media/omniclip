
import {ThreadList} from "../components/elements/thread-list.aui.js"

export function ThreadSidebar() {
	return <nav className="thread-sidebar" aria-label="Project chats">
		<div className="thread-sidebar-brand"><img src="/assets/logo/omni.png" alt="" /> Omniclip</div>
		<div className="assistant-ui-elements thread-sidebar-list"><ThreadList /></div>
	</nav>
}
