export function onAbort(signal: AbortSignal | undefined, cancel: () => void) {
	if (signal?.aborted) cancel()
	else signal?.addEventListener('abort', cancel, {once: true})
	return () => signal?.removeEventListener('abort', cancel)
}
