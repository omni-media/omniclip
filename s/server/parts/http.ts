
import sirv from "sirv"

export function setupHttp(dev: boolean) {
	return dev
		? sirv("x", {
			dev: true,
			etag: false,
			maxAge: 0,
		})
		: sirv("x", {
			dev: false,
			etag: true,
			gzip: true,
			brotli: true,
		})
}
