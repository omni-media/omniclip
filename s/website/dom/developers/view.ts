
import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Developers = shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`
		<section class="developers" id="developers">
			<h2>For developers</h2>
			<p class="section-intro">
				Take full control of video editing through code, automation, or CI/CD pipelines.
			</p>

				<div class="features">
					<h3 class=feature-header>
						Omni Tools API
					</h3>
					<div class="feature-content">
						<ul class="feature-list">
							<li>Modular library for code-driven video editing</li>
							<li>Powerful core with CLI, timeline format, and templates integration</li>
						</ul>

						<div class="code-preview">
							<pre><code>
// Create a video timeline programmatically
const watermark = subtitle("omniclip")
const xfade = crossfade(500)

const timeline = sequence(
  video("opening-credits.mp4"),
  xfade,
  stack(
    video("skateboarding.mp4"),
    watermark
  ),
  xfade,
  stack(
    video("biking.mp4"),
    watermark
  )
)
								</code></pre>
							</div>

							<!-- Sub-Feature: CLI -->
							<div class="sub-feature">
								<h4>CLI Automation</h4>
								<ul class="feature-list">
									<li>Render video projects via CLI (headless mode)</li>
									<li>Automate batch video exports, pipelines, or dev workflows</li>
								</ul>
								<div class="code-preview cli">
									<pre><code>
$ omnitool render project.json --output video.mp4
$ omnitool batch-render ./projects/* --output-dir ./exports
									</code></pre>
								</div>
							</div>

							<!-- Sub-Feature: Timeline Format -->
							<div class="sub-feature">
								<h4>Omni Timeline Format</h4>
								<ul class="feature-list">
									<li>Fully documented JSON timeline schema</li>
									<li>AI/automation compatible for custom agents or external tools</li>
								</ul>
								<div class="code-preview json">
									<pre><code>
// e.g. something like this 🤔
{
  "root": "root-1",
  "items": [
    ["root-1", ["sequence", { "children": ["video-1", "stack-1"] }]],
    ["video-1", ["video", { ... }]],
    ["stack-1", ["stack", { "children": ["text-1", "audio-1"] }]],
    ["text-1", ["text", { ... }]],
    ["audio-1", ["audio", { ... }]]
  ]
}
								</code></pre>
							</div>
						</div>

						<!-- Sub-Feature: Templates -->
						<div class="sub-feature">
							<h4>Reusable Templates</h4>
							<ul class="feature-list">
								<li>Build timeline templates to speed up repetitive workflows</li>
								<li>Share and import templates across projects and teams</li>
							</ul>
						</div>
						<button class=github-btn><sl-icon name=github></sl-icon>View on GitHub</button>
					</div>
				</div>
		</section>
	`
})
