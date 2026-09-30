
import {SearchIcon} from "lucide-react"
import {ThreadListItemPrimitive, ThreadListPrimitive} from "@assistant-ui/react"

export function ThreadSidebar({
	search,
	onSearchChange,
}: {
	search: string
	onSearchChange: (value: string) => void
}) {
	const query = search.trim().toLowerCase()

	return <nav className="thread-sidebar" aria-label="Project chats">
		<div className="thread-sidebar-label">Project chats</div>
		<ThreadListPrimitive.Root className="thread-navigation">
			<ThreadListPrimitive.New className="thread-new">
				<span aria-hidden="true">+</span> New chat
			</ThreadListPrimitive.New>
			<label className="thread-search">
				<SearchIcon size={15} aria-hidden="true" />
				<input
					type="search"
					aria-label="Search threads"
					placeholder="Search threads"
					value={search}
					onChange={event => onSearchChange(event.currentTarget.value)}
				/>
			</label>
			<div className="thread-list">
				<ThreadListPrimitive.Items>
					{({threadListItem}) => {
						if (query && !(threadListItem.title ?? "New chat").toLowerCase().includes(query))
							return null
						return <ThreadListItemPrimitive.Root key={threadListItem.id} className="thread-row">
							<ThreadListItemPrimitive.Trigger className="thread-trigger">
								<ThreadListItemPrimitive.Title fallback="New chat" />
							</ThreadListItemPrimitive.Trigger>
							<ThreadListItemPrimitive.Delete
								className="thread-delete"
								title="Delete chat"
								aria-label="Delete chat">
								×
							</ThreadListItemPrimitive.Delete>
						</ThreadListItemPrimitive.Root>
					}}
				</ThreadListPrimitive.Items>
			</div>
		</ThreadListPrimitive.Root>
	</nav>
}
