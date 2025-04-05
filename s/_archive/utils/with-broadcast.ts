import {Actions} from "../context/actions.js"

export interface BroadcastOptions {
	omit?: boolean
}

export function withBroadcast<T extends (...args: any[]) => any>(
	action: T,
	broadcastFn: (actionType: keyof Actions, payload: Parameters<ReturnType<T>>) => void
): (...args: Parameters<T>) => (...actionArgs: [...Parameters<ReturnType<T>>, BroadcastOptions?]) => ReturnType<T> {

	return (...args: Parameters<T>) => {
		return (...actionArgs: [...Parameters<ReturnType<T>>, BroadcastOptions?]) => {
			let omit = false
			const param = actionArgs[actionArgs.length - 1]
			// Check if the last argument is an options object with the 'omit' property
			if (
				param &&
				typeof param === 'object' &&
				'omit' in param
			) {
				const options = actionArgs.pop() as BroadcastOptions
				omit = options.omit ?? false
			}

			const actualArgs = actionArgs as unknown as Parameters<ReturnType<T>>

			const result = action(...args)(...actualArgs)

			if (!omit) {
				broadcastFn(action.name as keyof Actions, actualArgs)
			}

			return result
		}
	}
}
