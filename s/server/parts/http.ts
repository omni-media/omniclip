
import sirv from "sirv"

export function setupHttp(dev: boolean) {
	return dev
		? sirv("x/client", {
			dev: true,
			etag: false,
			maxAge: 0,
		})
		: sirv("x/client", {
			dev: false,
			etag: true,
			gzip: true,
			brotli: true,
		})
}
