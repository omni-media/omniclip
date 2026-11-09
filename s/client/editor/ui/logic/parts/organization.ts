
import {deepClone} from "@e280/stz"

import type {Index} from "./index.js"
import type {OmniSession} from "../session.js"
import {Tags} from "../../../context/parts/tags/tags.js"
import {Rules} from "../../../context/parts/rules/rules.js"
import type {OutlinerState} from "../../../context/parts/state.js"

/** Reads and validates changes to tags, rules, and their assignments. */
export class Organization {
	constructor(readonly session: OmniSession) {}

	tags(index: Index = this.session.index) {
		return new Tags(index, this.session.deps.strata.outliner.state)
	}

	rules(index: Index = this.session.index) {
		return new Rules(this.tags(index))
	}

	update(change: (state: OutlinerState) => void, onInvalid?: (rules: Rules) => void) {
		const {outliner} = this.session.deps.strata
		const draft = deepClone(outliner.state)
		change(draft)
		const rules = new Rules(new Tags(this.session.index, draft))
		if (!rules.valid()) {
			onInvalid?.(rules)
			return false
		}
		outliner.mutate(state => Object.assign(state, draft))
		return true
	}
}
