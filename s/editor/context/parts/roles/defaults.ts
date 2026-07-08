
import type {Role} from "../state.js"

export const defaultRoles: Role[] = [
	{id: -1, key: "video", name: "Video", scope: "video", color: "#34527a", enabled: true},
	{id: -2, key: "titles", name: "Titles", scope: "text", color: "#5c3b91", enabled: true},
	{id: -3, key: "dialogue", name: "Dialogue", scope: "audio", color: "#804c08", enabled: true},
	{id: -4, key: "music", name: "Music", scope: "audio", color: "#1b6937", enabled: true},
	{id: -5, key: "effects", name: "Effects", scope: "audio", color: "#696969", enabled: true},
]

