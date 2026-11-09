
import {Kind} from "@omnimedia/omnitool"

import type {Rules} from "./types.js"
import type {TagId} from "../tags/types.js"

/** Combined clips need permission for both their video and audio. */
function acceptsKind(accepts: readonly Kind[], kind: Kind) {
	return kind === Kind.Clip
		? accepts.includes(Kind.Video) && accepts.includes(Kind.Audio)
		: accepts.includes(kind)
}

/** Allow matches any listed tag; deny matches take precedence. */
export function allows(rules: Rules, kind: Kind, tagIds: readonly TagId[]) {
	return !restrictionReason(rules, kind, tagIds)
}

export function restrictionReason(rules: Rules, kind: Kind, tagIds: readonly TagId[]) {
	if (kind === Kind.Gap || kind === Kind.Transition) return
	if (rules.accepts && !acceptsKind(rules.accepts, kind)) return "kind"
	if (rules.deny?.some(id => tagIds.includes(id))) return "deny"
	if (rules.allow && !rules.allow.some(id => tagIds.includes(id))) return "allow"
}
