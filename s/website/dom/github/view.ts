
import {html} from "lit"
import {shadow, useCss, useMount, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import githubSvg from "../../../editor/ui/icons/remix-icon/github.svg.js"

type RepoStats = {
	stars: string
	forks: string
	issues: string
	loading: boolean
}

type Commit = {
	hash: string
	message: string
	author: string
	time: string
	url: string
}

const repoUrl = "https://github.com/omni-media/omniclip"
const fallbackStats: RepoStats = {
	stars: "1.4k",
	forks: "102",
	issues: "-",
	loading: false,
}

function formatCount(value: number) {
	return value >= 1000
		? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
		: `${value}`
}

function timeAgo(date: string) {
	const seconds = (Date.now() - new Date(date).getTime()) / 1000

	if (seconds < 60) return "just now"
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
	if (seconds < 86400 * 30) return `${Math.floor(seconds / 86400)}d ago`
	if (seconds < 86400 * 365) return `${Math.floor(seconds / (86400 * 30))}mo ago`
	return `${Math.floor(seconds / (86400 * 365))}y ago`
}

export const Github = shadow(() => {
	useCss(styleCss)

	const stats = useSignal<RepoStats>({
		stars: "-",
		forks: "-",
		issues: "-",
		loading: true,
	})
	const commits = useSignal<Commit[] | null>(null)
	const githubError = useSignal(false)

	useMount(() => {
		const controller = new AbortController()

		fetch("https://api.github.com/repos/omni-media/omniclip", {signal: controller.signal})
			.then(response => {
				if (!response.ok)
					throw new Error(`HTTP ${response.status}`)
				return response.json()
			})
			.then(data => {
				stats.value = {
					stars: formatCount(data.stargazers_count ?? 0),
					forks: formatCount(data.forks_count ?? 0),
					issues: `${data.open_issues_count ?? 0} open`,
					loading: false,
				}
			})
			.catch(() => {
				stats.value = fallbackStats
			})

		fetch("https://api.github.com/repos/omni-media/omniclip/commits?per_page=3", {signal: controller.signal})
			.then(response => {
				if (!response.ok)
					throw new Error(`HTTP ${response.status}`)
				return response.json()
			})
			.then(data => {
				if (!Array.isArray(data) || data.length === 0)
					throw new Error("empty")

				commits.value = data.map(commit => ({
					hash: (commit.sha ?? "").slice(0, 7),
					message: (commit.commit?.message ?? "(no message)").split("\n")[0].slice(0, 72),
					author: (commit.commit?.author?.name ?? "").split(" ")[0],
					time: commit.commit?.author?.date ? timeAgo(commit.commit.author.date) : "",
					url: commit.html_url ?? `${repoUrl}/commits`,
				}))
			})
			.catch(() => githubError.value = true)

		return () => controller.abort()
	})

	return html`
		<section class="gh-widget">
			<div class="gh-head">
				<div class="gh-repo">
					${githubSvg}
					<a href=${repoUrl} target="_blank" rel="noreferrer">omni-media/omniclip</a>
				</div>
				<div class="gh-stats">
					<span><b class=${stats.value.loading ? "loading" : ""}>${stats.value.stars}</b> stars</span>
					<span><b class=${stats.value.loading ? "loading" : ""}>${stats.value.forks}</b> forks</span>
					<span><b class=${stats.value.loading ? "loading" : ""}>${stats.value.issues}</b> issues</span>
				</div>
			</div>

			<div class="gh-commits-label">Recent commits</div>
			<ul class="gh-commits">
				${githubError.value ? html`
					<li class="gh-empty">couldn't reach github, probably rate-limited</li>
				` : commits.value
					? commits.value.map(commit => html`
						<li>
							<a class="gh-sha" href=${commit.url} target="_blank" rel="noreferrer">${commit.hash}</a>
							<span class="gh-msg">${commit.message}</span>
							<span class="gh-meta">${commit.author}${commit.time ? ` - ${commit.time}` : ""}</span>
						</li>
					`)
					: html`
						<li class="gh-skel"></li>
						<li class="gh-skel"></li>
						<li class="gh-skel"></li>
					`}
			</ul>
		</section>
	`
})

