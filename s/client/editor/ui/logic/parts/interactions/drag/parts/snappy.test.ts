//
// import {Science, expect, test} from "@e280/science"
// import {ms} from "@omnimedia/omnitool/x/units/ms.js"
// import {beginDrag, getSnapPointsForMove, proposeMove, snap} from "./snappy.js"
//
//
// const same = (a: unknown, b: unknown) =>
// 	expect(JSON.stringify(a)).is(JSON.stringify(b))
//
// export default Science.suite({
// 	"snap returns the original value when nothing is in range": test(async() => {
// 		expect(snap(ms(500), ms(50), [ms(100), ms(200)])).is(500)
// 	}),
//
// 	"snap returns the closest point within range": test(async() => {
// 		expect(snap(ms(980), ms(30), [ms(1000), ms(1200)])).is(1000)
// 	}),
//
// 	"snap points are generated from sibling starts and stitch points": test(async() => {
// 		const drag = beginDrag({
// 			clipId: 9,
// 			sourceLane: 0,
// 			clipStartTime: ms(1000),
// 			clipDuration: ms(500),
// 			pointerTime: ms(1100),
// 		})
//
// 		same(
// 			getSnapPointsForMove(drag, [
// 				{id: 1, start: ms(0), duration: ms(1000)},
// 				{id: 2, start: ms(2000), duration: ms(1000)},
// 			]),
// 			[0, 500, 1000, 1500, 2000, 2500, 3000],
// 		)
// 	}),
//
// 	"magnetic move inserts between siblings without gaps": test(async() => {
// 		const drag = beginDrag({
// 			clipId: 99,
// 			sourceLane: 0,
// 			clipStartTime: ms(1000),
// 			clipDuration: ms(500),
// 			pointerTime: ms(1100),
// 		})
//
// 		same(
// 			proposeMove({
// 				drag,
// 				pointerTime: ms(1200),
// 				targetLane: 0,
// 				magnetic: true,
// 				siblings: [
// 					{id: 1, start: ms(0), duration: ms(1000)},
// 					{id: 2, start: ms(1000), duration: ms(1000)},
// 				],
// 			}),
// 			{
// 				clipId: 99,
// 				lane: 0,
// 				startTime: 1000,
// 				insertIndex: 1,
// 				stitchLine: 1000,
// 			},
// 		)
// 	}),
//
// 	"freeform move preserves gaps": test(async() => {
// 		const drag = beginDrag({
// 			clipId: 99,
// 			sourceLane: 0,
// 			clipStartTime: ms(0),
// 			clipDuration: ms(500),
// 			pointerTime: ms(100),
// 		})
//
// 		same(
// 			proposeMove({
// 				drag,
// 				pointerTime: ms(2100),
// 				targetLane: 1,
// 				magnetic: false,
// 				snapRadius: ms(50),
// 				siblings: [
// 					{id: 1, start: ms(0), duration: ms(1000)},
// 					{id: 2, start: ms(3000), duration: ms(1000)},
// 				],
// 			}),
// 			{
// 				clipId: 99,
// 				lane: 1,
// 				startTime: 2000,
// 				insertIndex: 1,
// 				stitchLine: null,
// 			},
// 		)
// 	}),
//
// 	"freeform move snaps to the next stitch point": test(async() => {
// 		const drag = beginDrag({
// 			clipId: 99,
// 			sourceLane: 0,
// 			clipStartTime: ms(0),
// 			clipDuration: ms(500),
// 			pointerTime: ms(0),
// 		})
//
// 		same(
// 			proposeMove({
// 				drag,
// 				pointerTime: ms(2080),
// 				targetLane: 0,
// 				magnetic: false,
// 				snapRadius: ms(250),
// 				siblings: [
// 					{id: 1, start: ms(0), duration: ms(1000)},
// 					{id: 2, start: ms(2500), duration: ms(500)},
// 				],
// 			}),
// 			{
// 				clipId: 99,
// 				lane: 0,
// 				startTime: 2000,
// 				insertIndex: 1,
// 				stitchLine: 2500,
// 			},
// 		)
// 	}),
// })
