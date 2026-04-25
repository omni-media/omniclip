
import {FilterPropertyConfig, FilterSchema, Item, filters} from "@omnimedia/omnitool"

export type Path = (string | number)[]
export type FilterKey = keyof typeof filters

export const titleize = (value: string) =>
	value
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/^./, c => c.toUpperCase())

export const valueOf = (event: Event) => (event.target as any).value
export const checkedOf = (event: Event) => Boolean((event.target as any).checked)

export const Filters = {
	options: Object.entries(filters) as [FilterKey, (typeof filters)[FilterKey]][],

	keyFor(type: string) {
		return this._byType[type] ?? null
	},

	_byType: Object.fromEntries(
		Object.entries(filters).map(([key, def]) => [def.type, key])
	) as Record<string, FilterKey | undefined>
}

export const Schema = {
	defaultValue(config: FilterPropertyConfig): any {
		if ('default' in config)
			return config.default

		if (config.type === 'object')
			return Object.fromEntries(
				Object.entries(config.properties).map(([k, v]) => [k, Schema.defaultValue(v)])
			)

		if (config.type === 'array')
			return config.items.map(Schema.defaultValue)
	},

	defaultParams(schema: FilterSchema) {
		return Object.fromEntries(
			Object.entries(schema).map(([k, v]) => [k, Schema.defaultValue(v)])
		)
	},

	meta(filter: Item.Filter | null) {
		const key = filter ? Filters.keyFor(filter.type) : null
		const def = key ? filters[key] : null

		return {
			key,
			def,
			schemaEntries: def ? Object.entries(def.schema) : [],
			defaultParams: def ? this.defaultParams(def.schema) : {}
		}
	}
}

export const updateAtPath = (source: any, path: Path, value: any): any => {
	if (!path.length) return value

	const [head, ...tail] = path
	const current = source ?? (typeof head === 'number' ? [] : {})
	const next = Array.isArray(current) ? [...current] : {...current}

	next[head] = updateAtPath(next[head], tail, value)
	return next
}

