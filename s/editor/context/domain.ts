
export type DomainTree = {[key: string]: Domain | DomainTree}

export abstract class Domain {
	state: {
		historical: any
		nonHistorical: any
	} = {} as any

	actions: Record<string, () => any> = {}

	static consolidate<T extends DomainTree>(domainTree: T): T {
		// TODO
		return domainTree
	}
}

