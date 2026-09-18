import {glob, readFile} from "node:fs/promises"

type Skill = {description: string; root: URL}

const sources = [
	new URL(`${import.meta.resolve("@omnimedia/omnitool/skills")}/`),
]

async function discover(source: URL) {
	const found: [name: string, skill: Skill][] = []

	for await (const path of glob("*/SKILL.md", {cwd: source})) {
		const name = path.slice(0, -"/SKILL.md".length)
		const content = await readFile(new URL(path, source), "utf8")
		const description = content.match(/^description:\s*(.+)$/m)?.[1].trim()
		if (!description) throw new Error(`Skill requires a description: ${name}`)

		found.push([name, {description, root: new URL(`${name}/`, source)}])
	}

	return found
}

const entries = (await Promise.all(sources.map(discover))).flat()
const skills = new Map(entries)
if (skills.size !== entries.length) throw new Error("Skill names must be unique")

const catalog = [...skills].sort(([a], [b]) => a.localeCompare(b))
export const skillNames = catalog.map(([name]) => name)

export async function readSkill(name: string, path: string) {
	const root = skills.get(name)?.root
	if (!root) return `Skill not found: ${name}`

	const file = new URL(path, root)
	if (file.protocol !== "file:" || file.search || file.hash || !file.href.startsWith(root.href))
		return `Invalid skill path: ${name}/${path}`

	let content: string
	try {content = await readFile(file, "utf8")}
	catch {return `Skill file not found: ${name}/${path}`}

	return path.endsWith(".json") ? JSON.stringify(JSON.parse(content)) : content
}

export const skillInstructions = `
Available skills:
${catalog.map(([name, skill]) => `- ${name}: ${skill.description}`).join("\n")}

For a question or task covered by a skill, call read_skill for its SKILL.md before answering. Follow its paths and read only the files needed for the task.`
