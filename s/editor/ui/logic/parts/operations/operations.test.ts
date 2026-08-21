
import {deep} from "@e280/stz"
import {Science, expect, test} from "@e280/science"
import {Kind, Item, Id} from "@omnimedia/omnitool"

import {spliceChildren, wrapSiblings} from "./operations.js"

const mock = {
	video: (id: Id) => ({ id, kind: Kind.Video }),
	stack: (id: Id, childrenIds: Id[]) => ({ id, kind: Kind.Stack, childrenIds }),
	sequence: (id: Id, childrenIds: Id[]) => ({ id, kind: Kind.Sequence, childrenIds }),
}

export default Science.suite({
	"move item to sequence": test(async () => {
		const seq = mock.sequence(100, [1, 2])
		const result = spliceChildren(seq.childrenIds, 3, 1)
		expect(deep.equal(result, [1, 3, 2])).ok()
	}),

	"move item to stack": test(async () => {
		const root = mock.stack(200, [10, 20])
		const result = spliceChildren(root.childrenIds, 30, 0)
		expect(deep.equal(result, [30, 10, 20])).ok()
	}),

	"move item after standalone item": test(async () => {
		const root = mock.stack(300, [1])
		const movingId = 2
		const targetId = 1

		const sequence = mock.sequence(400, [targetId, movingId])
		const parent = wrapSiblings(
			root as Item.Stack,
			targetId,
			movingId,
			sequence as Item.Sequence,
		)

		expect(deep.equal(parent.childrenIds, [400])).ok()
		expect(deep.equal(sequence.childrenIds, [1, 2])).ok()
	}),

	"move item before standalone item": test(async () => {
		const root = mock.stack(300, [1])

		const sequence = mock.sequence(400, [2, 1])
		wrapSiblings(
			root as Item.Stack,
			1,
			2,
			sequence as Item.Sequence,
		)

		expect(deep.equal(sequence.childrenIds, [2, 1])).ok()
	}),

	"move item after item in stack": test(async () => {
		const children = [1, 2]
		const result = spliceChildren(children, 1, 1)
		expect(deep.equal(result, [2, 1])).ok()
	}),

	"move item before item in stack": test(async () => {
		const children = [1, 2]
		const result = spliceChildren(children, 2, 0)
		expect(deep.equal(result, [2, 1])).ok()
	}),

	"move item after item in sequence": test(async () => {
		const children = [1, 2, 3]
		const result = spliceChildren(children, 1, 1)
		expect(deep.equal(result, [2, 1, 3])).ok()
	}),

	"move item before item in sequence": test(async () => {
		const children = [1, 2, 3]
		const result = spliceChildren(children, 3, 0)
		expect(deep.equal(result, [3, 1, 2])).ok()
	}),
})

