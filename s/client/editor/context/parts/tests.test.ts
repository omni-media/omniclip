
import {Kind} from "@omnimedia/omnitool"
import {Science, expect, test} from "@e280/science"

import {Strata} from "./strata.js"
import {makeDefaultState} from "./state.js"
import {Index} from "../../ui/logic/parts/index.js"
import {assignRules, removeRule} from "./rules/ops.js"
import type {OmniSession} from "../../ui/logic/session.js"
import {Organization} from "../../ui/logic/parts/organization.js"
import {assignTags, copyTags, moveTag, removeTag} from "./tags/ops.js"

function setup() {
	const strata = new Strata("test", {} as Storage)
	const state = makeDefaultState()
	state.edit.present.timeline.rootId = "root"
	state.edit.present.timeline.items = [
		{id: "root", kind: Kind.Stack, childrenIds: ["sequence", "other"]},
		{id: "sequence", kind: Kind.Sequence, childrenIds: ["audio"]},
		{id: "other", kind: Kind.Sequence, childrenIds: []},
		{id: "audio", kind: Kind.Audio, duration: 1000, start: 0, mediaHash: "mock", gain: 1},
	]
	strata.trunk.set(state)
	const session = {
		deps: {strata},
		get index() { return new Index(strata.timeline.state) },
	} as unknown as OmniSession
	return {strata, organization: new Organization(session)}
}

export default Science.suite({
	rules: Science.suite({
		"a rule can be reused across sequences": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.rules.push({id: "audio", label: "Audio", accepts: [Kind.Audio]})
				assignRules(state, "sequence", ["audio"])
				assignRules(state, "other", ["audio"])
			})
			expect(organization.rules().assigned("sequence")[0].id).is("audio")
			expect(organization.rules().allowsUntaggedKind("other", Kind.Video)).is(false)
		}),
		"a rule cannot be applied until existing items match": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music"})
				state.rules.push({id: "music", label: "Music", allow: ["music"]})
			})
			expect(organization.update(state => assignRules(state, "sequence", ["music"]))).is(false)
			organization.update(state => assignTags(state, "audio", ["music"]))
			expect(organization.update(state => assignRules(state, "sequence", ["music"]))).is(true)
		}),
		"an edit cannot make a shared rule reject existing items": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.rules.push({id: "audio", label: "Audio", accepts: [Kind.Audio]})
				assignRules(state, "sequence", ["audio"])
				assignRules(state, "other", ["audio"])
			})
			expect(organization.update(state => { state.rules[0].accepts = [Kind.Video] })).is(false)
			expect(organization.rules().assigned("sequence")[0].accepts).deep([Kind.Audio])
		}),
		"deleting a rule removes it from every sequence": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.rules.push({id: "audio", label: "Audio"})
				assignRules(state, "sequence", ["audio"])
				assignRules(state, "other", ["audio"])
			})
			organization.update(state => removeRule(state, "audio"))
			expect(organization.rules().assigned("sequence")).deep([])
			expect(organization.rules().assigned("other")).deep([])
		}),
		"parent rules restrict nested sequences": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.rules.push({id: "audio", label: "Audio", accepts: [Kind.Audio]})
				assignRules(state, "root", ["audio"])
			})
			expect(organization.rules().allowsUntaggedKind("other", Kind.Audio)).is(true)
			expect(organization.rules().allowsUntaggedKind("other", Kind.Video)).is(false)
		}),
		"combined clips need both audio and video allowed": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.rules.push({id: "audio", label: "Audio", accepts: [Kind.Audio]})
				assignRules(state, "other", ["audio"])
			})
			expect(organization.rules().allowsUntaggedKind("other", Kind.Clip)).is(false)
			organization.update(state => { state.rules[0].accepts = [Kind.Audio, Kind.Video] })
			expect(organization.rules().allowsUntaggedKind("other", Kind.Clip)).is(true)
		}),
		"denied tags take precedence over allowed tags": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music"})
				state.rules.push({id: "filter", label: "Filter", allow: ["music"], deny: ["music"]})
				assignTags(state, "audio", ["music"])
				assignRules(state, "other", ["filter"])
			})
			expect(organization.rules().allowsItem("other", "audio")).is(false)
			organization.update(state => { delete state.rules[0].deny })
			expect(organization.rules().allowsItem("other", "audio")).is(true)
		}),
		"moving a structure checks the items inside it": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.rules.push({id: "video", label: "Video", accepts: [Kind.Video]})
				assignRules(state, "other", ["video"])
			})
			expect(organization.rules().allowsItem("other", "sequence")).is(false)
			organization.update(state => { state.rules[0].accepts = [Kind.Audio] })
			expect(organization.rules().allowsItem("other", "sequence")).is(true)
		}),
	}),
	tags: Science.suite({
		"deleting a tag removes it from items and rules": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music"})
				state.rules.push({id: "audio", label: "Audio", allow: ["music"]})
				assignTags(state, "audio", ["music"])
				assignRules(state, "sequence", ["audio"])
			})
			expect(organization.update(state => removeTag(state, "music"))).is(true)
			expect(organization.tags().ids("audio")).deep([])
			expect(organization.rules().assigned("sequence")[0].allow).is(undefined)
		}),
		"children inherit tag colors but not tags": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music", color: "#ffaa00"})
				assignTags(state, "sequence", ["music"])
			})
			expect(organization.tags().color("audio")).is("#ffaa00")
			expect(organization.tags().ids("audio")).deep([])
		}),
		"copied tags can be edited independently": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music"})
				assignTags(state, "sequence", ["music"])
				copyTags(state, "sequence", ["other"])
			})
			organization.update(state => assignTags(state, "sequence", []))
			expect(organization.tags().ids("sequence")).deep([])
			expect(organization.tags().ids("other")).deep(["music"])
		}),
		"reordering tags changes the displayed color": test(async () => {
			const {organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music", color: "#ffaa00"}, {id: "review", label: "Review", color: "#aa00ff"})
				assignTags(state, "audio", ["music", "review"])
			})
			expect(organization.tags().color("audio")).is("#ffaa00")
			organization.update(state => {
				const ids = state.tagAssignments[0].tagIds
				assignTags(state, "audio", moveTag(ids, "review", "music"))
			})
			expect(organization.tags().color("audio")).is("#aa00ff")
		}),
	}),
	outliner: Science.suite({
		"undo restores a deleted structure and its assignments in one step": test(async () => {
			const {strata, organization} = setup()
			organization.update(state => {
				state.tags.push({id: "music", label: "Music"})
				state.rules.push({id: "audio", label: "Audio"})
				assignTags(state, "sequence", ["music"])
				assignRules(state, "sequence", ["audio"])
			})
			strata.timeline.mutate(timeline => {
				timeline.items = timeline.items.filter(item => item.id !== "sequence" && item.id !== "audio")
				const root = timeline.items[0]
				if ("childrenIds" in root) root.childrenIds = ["other"]
			})
			strata.syncOutliner()
			expect(strata.outliner.state.tagAssignments).deep([])
			expect(strata.outliner.state.ruleAssignments).deep([])
			strata.edit.undo()
			strata.syncOutliner()
			expect(strata.timeline.state.items.some(item => item.id === "sequence")).is(true)
			expect(organization.tags().ids("sequence")).deep(["music"])
			expect(organization.rules().assigned("sequence").map(rule => rule.id)).deep(["audio"])
		}),
	}),
})
