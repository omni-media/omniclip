
import {ExposedError} from "@e280/renraku"

export function exposeErrors<Args extends unknown[], Result>(fn: (...args: Args) => Result | Promise<Result>) {
	return async(...args: Args) => {
		try {
			return await fn(...args)
		}
		catch (error) {
			throw new ExposedError(error instanceof Error ? error.message : String(error))
		}
	}
}
