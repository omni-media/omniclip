
import type {AssistantContext, MediaInfo} from "../assistant/types.js"
import type {TimelinePatch, TimelinePatchResult} from "../timeline.js"
import type {ProjectSettingsUpdate} from "../settings.js"

export const bridgePort = 3789

export type EditorRpc = {
	cancel: (id: string) => Promise<void>
	create_item: () => Promise<{id: string}>
	read_project_context: () => Promise<AssistantContext>
	update_settings: (settings: ProjectSettingsUpdate) => Promise<AssistantContext>
	provide_media: (args: {mediaHash: string; uploadUrl: string}, id: string) => Promise<MediaInfo>
	patch_timeline: (patch: TimelinePatch, id: string) => Promise<{result: TimelinePatchResult; context: AssistantContext}>
}
