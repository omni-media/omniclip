
import {Cellar} from "@e280/quay"
import {Strata} from "../strata.js"

export class CargoController {
	constructor(public strata: Strata, public cellar: Cellar) {}

	async refresh() {
		await this.strata.files.mutate(async s => {
			s.hashes = await Array.fromAsync(this.cellar.list())
		})
	}

	async deleteFile(hash: string) {
		await this.cellar.delete(hash)
		await this.refresh()
	}
}

