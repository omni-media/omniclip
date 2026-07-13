
import {Id, Kind} from "@omnimedia/omnitool"
import {useMount, useSignal} from "@e280/sly"

import {EditorContext} from "../../../../../../context/context.js"

export function useMixerLevels(context: EditorContext) {
	const levels = useSignal(new Map<Id, number>())
	const masterLevel = useSignal(0)
	const masterGain = useSignal(context.strata.masterGain.state)

	useMount(() => {
		const roleStops = new Map<Id, () => void>()
		const audioItemIds = () => new Set(context.strata.timeline.state.items
			.filter(item => item.kind === Kind.Audio)
			.map(item => item.id)
		)
		const itemIdsForRole = (roleId: Id) => {
			const familyIds = context.session.roles.lookup.familyIds(roleId)
			return context.strata.outliner.state.items
				.filter(item => familyIds.includes(item.roleId) && audioItemIds().has(item.itemId))
				.map(item => item.itemId)
		}
		const setRoleLevel = (roleId: Id, peak: number) =>
			levels(new Map(levels()).set(roleId, peak))

		const stopMasterLevel = context.player.audio.levels.on(
			() => audioItemIds(),
			({peak}) => masterLevel(peak),
		)
		const syncRoles = () => {
			const roleIds = new Set(context.session.roles.lookup.roles
				.filter(role => role.scope === "audio")
				.map(role => role.id)
			)

			for (const [roleId, stop] of roleStops) {
				if (!roleIds.has(roleId)) {
					stop()
					roleStops.delete(roleId)
				}
			}

			for (const roleId of roleIds) {
				if (!roleStops.has(roleId))
					roleStops.set(roleId, context.player.audio.levels.on(
						() => itemIdsForRole(roleId),
						({peak}) => setRoleLevel(roleId, peak),
					))
			}
		}

		syncRoles()
		const stopRoleSync = context.strata.outliner.on(syncRoles)
		const stopMasterGain = context.strata.masterGain.on(gain => {
			masterGain(gain)
		})
		const stopPlayback = context.session.playback.$isPlaying.on(playing => {
			if (!playing) {
				levels(new Map())
				masterLevel(0)
			}
		})

		return () => {
			stopMasterLevel()
			stopRoleSync()
			stopMasterGain()
			stopPlayback()
			for (const stop of roleStops.values())
				stop()
		}
	})

	return {levels, masterLevel, masterGain}
}

