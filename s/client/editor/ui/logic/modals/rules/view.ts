
import {css, html} from "lit"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useSignal} from "@e280/sly"

import {EditorContext} from "../../../../context/context.js"
import {itemKinds} from "../../../../context/parts/rules/kinds.js"
import modalCss from "../../../../context/parts/modal/modal.css.js"
import type {Rule, Rules} from "../../../../context/parts/rules/types.js"

import "@awesome.me/webawesome/dist/components/input/input.js"
import "@awesome.me/webawesome/dist/components/select/select.js"
import "@awesome.me/webawesome/dist/components/option/option.js"
import "@awesome.me/webawesome/dist/components/button/button.js"

export type RuleDraft = Rules & {label: string}

type Options = {
	rule?: Rule
	save: (draft: RuleDraft) => string | null
	cancel: () => void
}

export const RuleEditor = shadow((context: EditorContext, options: Options) => {
	useCss(modalCss, css`
		.fields {
			display: grid;
			gap: 1em;
		}

		wa-input, wa-select {
			--wa-form-control-label-color: #aaa;
		}

		.error {
			margin: 0;
			color: #ff8f8f;
			font-size: var(--font-size-xs);
		}
	`)
	const label = useSignal(options.rule?.label ?? "")
	const conditions = useSignal<Rules>({
		accepts: options.rule?.accepts,
		allow: options.rule?.allow,
		deny: options.rule?.deny,
	})
	const error = useSignal("")
	const tagOptions = context.strata.outliner.state.tags.map(tag => ({value: tag.id, label: tag.label}))

	const updateCondition = (key: keyof Rules, event: Event) => {
		const values = (event.currentTarget as HTMLElementTagNameMap["wa-select"]).value as string[]
		const next = {...conditions()}
		if (!values.length) delete next[key]
		else if (key === "accepts") next.accepts = values.map(Number)
		else next[key] = [...values]
		conditions(next)
	}

	const select = (key: keyof Rules, name: string, options: readonly {value: string, label: string}[]) => html`
		<wa-select size="small" multiple with-clear
			label=${name}
			placeholder="Unrestricted"
			.value=${(conditions()[key] ?? []).map(String)}
			@change=${(event: Event) => updateCondition(key, event)}>
			${repeat(options, option => `${option.value}:${option.label}`, option => html`
				<wa-option value=${option.value}>${option.label}</wa-option>
			`)}
		</wa-select>`

	const save = () => error(options.save({label: label().trim(), ...conditions()}) ?? "")

	return html`<div class="fields">
		<wa-input size="small" label="Rule name"
			.value=${label()}
			@input=${(event: Event) => label((event.currentTarget as HTMLElementTagNameMap["wa-input"]).value ?? "")}>
		</wa-input>
		${select("accepts", "Accepted item kinds", itemKinds.map(({kind, label}) => ({value: String(kind), label})))}
		${select("allow", "Allow any of these tags", tagOptions)}
		${select("deny", "Deny these tags", tagOptions)}
		${error() ? html`<p class="error" role="alert">${error()}</p>` : ""}
		<div class="modal-footer">
			<wa-button size="small" appearance="plain" @click=${options.cancel}>Cancel</wa-button>
			<wa-button size="small" ?disabled=${!label().trim()} @click=${save}>
				${options.rule ? "Save" : "Create rule"}
			</wa-button>
		</div>
	</div>`
})

