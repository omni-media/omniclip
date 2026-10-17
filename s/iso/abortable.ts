
import {defer} from "@e280/stz"

export async function abortable<Result>(promise: Promise<Result>, signal: AbortSignal, onAbort: () => void) {
	if (signal.aborted) {
		onAbort()
		signal.throwIfAborted()
	}
	const aborted = defer<never>()
	const abort = () => {
		onAbort()
		aborted.reject(signal.reason)
	}
	signal.addEventListener("abort", abort, {once: true})
	try {
		return await Promise.race([promise, aborted.promise])
	}
	finally {
		signal.removeEventListener("abort", abort)
	}
}
