import {openai} from "@ai-sdk/openai"

export class Hub {
	constructor(public assistantModel = openai("gpt-5.6-luna")) {}
}
