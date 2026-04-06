
import {Science, test, expect} from "@e280/science"
import operationsTest from "./editor/ui/logic/parts/operations/operations.test.js"

await Science.run({
	"addition works": test(async() => {
		expect(2 + 2).is(4)
	}),
	operationsTest
})

