
import {collect} from "@e280/stz"
import {Kind} from "@omnimedia/omnitool"
import {useEffect, useState} from "react"
import {reactBindings} from "@e280/strata"
import {FilmIcon, Music2Icon} from "lucide-react"
import {unstable_useMentionAdapter, type Unstable_Mention} from "@assistant-ui/react"

import {itemLabel} from "../../../utils/item-label.js"
import {mentionFormatter} from "../parts/mention-format.js"
import type {EditorContext} from "../../../../../context/context.js"
import {ComposerTriggerPopover} from "../components/elements/composer-trigger-popover.aui.js"

const {useTracked} = reactBindings({useEffect, useState})

export function Mentions({context}: {context: EditorContext}) {
	const timelineItems = useTracked(() => context.strata.timeline.state.items)
	const [libraryMedia, setLibraryMedia] = useState<Unstable_Mention[]>([])

	useEffect(() => {
		const library = context.controllers.cargo.editorLibrary
		const refreshMedia = async () => {
			const records = await collect(library.records())
			const mentions = records
				.filter(({format}) => format === "audio" || format === "video")
				.map(({hash, label, format}) => ({
					id: hash,
					type: "media",
					label,
					description: format === "audio" ? "Audio" : "Video",
					icon: format,
					metadata: {location: "Library"},
				}))
			setLibraryMedia(mentions)
		}

		void refreshMedia()
		return library.on.refresh.sub(() => {void refreshMedia()})
	}, [context])

	const mentionAdapter = unstable_useMentionAdapter({
		formatter: mentionFormatter,
		items: [
			...timelineItems
				.filter(item =>
					item.kind === Kind.Audio || item.kind === Kind.Video || item.kind === Kind.Clip,
				)
				.map(item => ({
					id: item.id,
					type: "timeline",
					label: itemLabel(item),
					description: item.kind === Kind.Audio ? "Audio" : "Video",
					icon: item.kind === Kind.Audio ? "audio" : "video",
					metadata: {location: "Timeline"},
				})),
			...libraryMedia,
		],
	})

	return (
		<ComposerTriggerPopover
			char="@"
			{...mentionAdapter}
			iconMap={{audio: Music2Icon, video: FilmIcon}}
		/>
	)
}

