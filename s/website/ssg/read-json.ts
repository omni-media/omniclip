
import {read_file} from "@benev/turtle"

export async function readJson(path: string) {
	return JSON.parse(await read_file(path))
}

