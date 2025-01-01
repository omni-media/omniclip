import {Actions} from "../context/actions.js"

// action with broadcast
export function withBroadcast<T extends (...args: any[]) => any>(
	action: T,
	broadcastFn: (actionType: keyof Actions, payload: Parameters<ReturnType<T>>) => void
) {
	return (...args: Parameters<T>) => {
		return (...actionArgs: [...Parameters<ReturnType<T>>, boolean?]) => {
			// Check if the last argument is a boolean (omit flag)
			const omit = typeof actionArgs[actionArgs.length - 1] === 'boolean'
				? (actionArgs.pop() as boolean)
				: false

			const actualArgs = actionArgs as unknown as Parameters<ReturnType<T>>

			const result = action(...args)(...actualArgs)

			if (!omit) {
				broadcastFn(action.name as keyof Actions, actualArgs)
			}

			return result
		}
	}
}
