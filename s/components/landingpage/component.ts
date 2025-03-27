import {LitElement, html} from "lit"
import {property} from "lit/decorators.js"

import styles from "./styles.js"
import {transitions} from "./constants.js"
import keyframesSvg from "../../icons/keyframes.svg.js"
import addSvg from "../../icons/gravity-ui/add.svg.js"
import bellSvg from "../../icons/gravity-ui/bell.svg.js"
import codeSvg from "../../icons/remix-icon/code.svg.js"
import syncSvg from "../../icons/remix-icon/sync.svg.js"
import {removeLoadingPageIndicator} from "../../main.js"
import lockSvg from "../../icons/gravity-ui/lock.svg.js"
import githubSvg from "../../icons/remix-icon/github.svg.js"
import peopleSvg from "../../icons/gravity-ui/people.svg.js"
import shieldSvg from "../../icons/gravity-ui/shield.svg.js"
import discordSvg from "../../icons/remix-icon/discord.svg.js"
import speechToTextSvg from "../../icons/speech-to-text.svg.js"
import computerSvg from "../../icons/remix-icon/computer.svg.js"
import arrowRightSvg from "../../icons/gravity-ui/arrow-right.svg.js"
import rocketSvg from "../../icons/material-design-icons/rocket.svg.js"
import externalLinkSvg from "../../icons/gravity-ui/external-link.svg.js"

export class LandingPage extends LitElement {
	static styles = styles

	@property({type: Boolean})
	menuOpened = false

	@property({type: String})
	currentTransition = transitions[0]

	@property({type: Boolean})
	transitionsDropdownOpen = false

	transitionsVideo: null | HTMLVideoElement = null

	interval = 0
	
	// Toggle transitions dropdown
	toggleTransitionsDropdown = (e: MouseEvent) => {
		e.stopPropagation()
		this.transitionsDropdownOpen = !this.transitionsDropdownOpen
		this.requestUpdate()
		
		if (this.transitionsDropdownOpen) {
			setTimeout(() => {
				window.addEventListener('click', this.closeTransitionsDropdown)
			}, 0)
		}
	}

	// Close transitions dropdown
	closeTransitionsDropdown = (e: MouseEvent) => {
		const dropdown = this.shadowRoot?.querySelector('.transitions-dropdown')
		const moreButton = this.shadowRoot?.querySelector('.more-transitions')
		
		if (dropdown && moreButton && 
				!dropdown.contains(e.target as Node) && 
				!moreButton.contains(e.target as Node)) {
			this.transitionsDropdownOpen = false
			this.requestUpdate()
			window.removeEventListener('click', this.closeTransitionsDropdown)
		}
	}

	menuClick = (e: MouseEvent) => {
		const hamburger = e.composedPath().find(e => (e as HTMLElement).className === "menu-icon")
		const navmenu = e.composedPath().find(e => (e as HTMLElement).className === "menu")
		if(hamburger)
			return
		if(!navmenu) {
			this.menuOpened = false
			this.requestUpdate()
		}
	}

	setCurrentTransition(e: Event) {
		const target = e.currentTarget as HTMLElement
		const index = target.getAttribute("data-index")
		if(index) {
			const transitionDuration = 3.492
			this.transitionsVideo!.currentTime = +index * transitionDuration
			this.currentTransition = transitions[Math.floor(+index)]
			this.requestUpdate()
		}
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener("click", this.menuClick)
		removeLoadingPageIndicator()
	}

	disconnectedCallback() {
		clearInterval(this.interval)
		super.disconnectedCallback()
		window.removeEventListener("click", this.menuClick)
		window.removeEventListener('click', this.closeTransitionsDropdown)
	}

	firstUpdated() {
		const transitionDuration = 3.492
		const video = this.shadowRoot?.querySelector(".transitions-video") as HTMLVideoElement
		this.transitionsVideo = video
		this.interval = setInterval(() => {
			const index = Math.floor(video.currentTime / transitionDuration)
			this.currentTransition = transitions[index]
			this.requestUpdate()
		}, 100)
		const path = this.getCurrentPath()
		this.scrollIntoElementView(path)
	}

	getCurrentPath() {
		return window.location.hash.slice(1) || "/"
	}

	scrollIntoElementView(id: string) {
		try {
			const element = this.shadowRoot?.querySelector(`#${id}`)
			element?.scrollIntoView({behavior: "smooth"})
		} catch(e) {}
	}

	render() {return html`
		<div class="landing-page">
			<nav>
				<img class="logo" src="/assets/icon3.png" />
				<img @click=${() => {
					this.menuOpened = !this.menuOpened
					this.requestUpdate()
				}} class="menu-icon" src="/assets/hamburger.svg">
				<div class="menu" ?data-opened=${this.menuOpened}>
					<a @click=${() => this.scrollIntoElementView("welcome")} href="#welcome">Home</a>
					<a @click=${() => this.scrollIntoElementView("capabilities")} href="#capabilities">Features</a>
					<a @click=${() => this.scrollIntoElementView("coming-soon")} href="#coming-soon">Coming Soon</a>
					<a class="try" href="#/editor">Try it out ${arrowRightSvg}</a>
				</div>
				<div class="nav">
					<a @click=${() => this.scrollIntoElementView("welcome")} href="#welcome">Home</a>
					<a @click=${() => this.scrollIntoElementView("capabilities")} href="#capabilities">Features</a>
					<a @click=${() => this.scrollIntoElementView("coming-soon")} href="#coming-soon">Coming Soon</a>
				</div>
				<div class="nav">
					<a class="try" href="#/editor">Try it out ${arrowRightSvg}</a>
				</div>
			</nav>
			
			<!-- Welcome Section -->
			<section id="welcome" class="welcome">
				<p>video editor on the web</p>
				<h1>
					<span>Powerful video editor</span><br>
					<span>right in your browser</span>
				</h1>
				<h2>
					<span>Open-source, privacy-focused, runs everywhere.</span><br>
					<span>All your data stays on your device.</span>
				</h2>
				<div class="btns">
					<a
						class="try"
						href="#/editor"
					>
						Start for free
					</a>
					<a
						href="https://discord.gg/Nr8t9s5wSM"
						class="discord"
						target="_blank"
					>
						${discordSvg} Join Discord
					</a>
				</div>
			</section>
			
			<!-- Capabilities Section -->
			<section id="capabilities" class="abilities">
				<h2>Capabilities</h2>
				<div class="items">
					<h4>All the basic stuff, you can add audio/image/text/video and trim or split it, but there's more!</h4>
					<div class="flex">
						<div class="item">
							<img src="/assets/trim.svg" />
							<p>Trim</p>
						</div>
						<div class="item">
							<img src="/assets/split.svg" />
							<p>Split</p>
						</div>
						<div class="item">
							<img src="/assets/text.svg" />
							<p>Text</p>
						</div>
						<div class="item">
							<img src="/assets/images.svg" />
							<p>Images</p>
						</div>
						<div class="item">
							<img src="/assets/audio.svg" />
							<p>Audio</p>
						</div>
					</div>
					<div class="more">
						<div class="flex">
							<div class="item-more">
								<h3>Animations</h3>
								<p>7 animations to play with<br>
								but there's more to come!</p>
								<video autoplay loop muted width="250">
									<source src="/assets/animation.mp4" type="video/mp4" />
								</video>
							</div>
							<div class="item-more">
								<h3>Filters</h3>
								<p>As much as 30+ filters!<br> you can mix and match them too.</p>
								<video autoplay loop muted width="250">
									<source src="/assets/filters.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
						<div class="flex">
							<div class="item-more">
								<h3>Resizable Panels</h3>
								<p>Adjustable panels<br>customize workspace the way you want<br>
								</p>
								<video autoplay loop muted width="250">
									<source src="/assets/resizable.mp4" type="video/mp4" />
								</video>
							</div>
							<div class="item-more">
								<h3>Local Fonts</h3>
								<p>Auto-loading fonts from<br> your device for seamless typography.<br>
								</p>
								<video autoplay loop muted width="250">
									<source src="/assets/localfonts.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
					<div class="export">
						<div>
							<h3>Export your video up to 4k!</h3>
							<ul>
								<li>No credit card required! <span class="emoji">&#129327;</span></li>
								<li>Unparalleled speed <span class="emoji">&#9889;</span></li>
								<li>Choose desired<br> bitrate & aspect ratio <span class="emoji">&#9881;</span></li>
								<li>
									Try it out!
									<a
										class="try"
										href="#/editor"
									>
										Open editor
									</a>
								</li>
							</ul>
						</div>
						<video autoplay loop muted width="250">
							<source src="/assets/export4k.mp4" type="video/mp4" />
						</video>
					</div>
				</div>
			</section>
			
			<!-- Collaboration Section -->
			<section id="collaboration" class="collaboration">
				<div class="collab-container">
					<div class="collab-content">
						<h2>Edit Together in Real-Time</h2>
						<p>
							Create amazing videos as a team with Omniclip's powerful collaboration features.
							Multiple editors can work on the same project simultaneously, seeing changes instantly.
						</p>
						<div class=flex>
							<ul class="collab-features">
								<li>
									<div class="feature-icon">${peopleSvg}</div>
									<div class="feature-text">
										<h3>Multi-User Editing</h3>
										<p>Invite teammates to edit your project in real-time</p>
									</div>
								</li>
								<li>
									<div class="feature-icon">${syncSvg}</div>
									<div class="feature-text">
										<h3>Instant Sync</h3>
										<p>See changes immediately across all connected devices</p>
									</div>
								</li>
							</ul>

						<div class="collab-visual">
							<div class="collab-demo">
								<!-- Mock media player preview -->
								<div class="media-preview">
									<div class="media-frame"></div>
									<div class="media-controls">
										<button>⏮</button>
										<button>⏯</button>
										<button>⏭</button>
									</div>
								</div>

								<!-- Timeline with blocks -->
								<div class="timeline">
									<div class="track">
										<div class="clip video-clip" style="left: 5%; width: 30%;"></div>
										<div class="clip audio-clip" style="left: 40%; width: 20%;"></div>
										<div class="clip video-clip" style="left: 65%; width: 25%;"></div>
									</div>
									<div class="collab-cursors">
										<div class="cursor cursor-1" data-user="Alex" style="--start: 10%; --end: 50%"></div>
										<div class="cursor cursor-2" data-user="Taylor" style="--start: 60%; --end: 30%"></div>
									</div>
								</div>
							</div>
						</div>

						</div>
						<a class="try collab-cta" href="#/editor">
							Try Collaboration Now
						</a>
					</div>
				</div>
			</section>
			
			<!-- Transitions Section -->
			<section id="transitions" class="transitions">
				<div class="transitions-header">
					<h2>Community-Driven Transitions</h2>
					<p>Powered by <a href="https://gl-transitions.com/" target="_blank" class="gl-link">GL Transitions</a>, a collection of GLSL transitions created by developers worldwide.</p>
				</div>
				
				<div class="transitions-container">
					<div class="transitions-info">
						<div class="transition-features">
							<div class="feature">
								<div class=flex>
									<div class="feature-icon">
										${codeSvg}
									</div>
									<h3>Open Source Transitions</h3>
								</div>
								<div class="feature-content">
									<p class=small>Access to 60+ high-quality transitions created and maintained by the community</p>
								</div>
							</div>
							
							<div class="feature">
								<div class=flex>
									<div class="feature-icon">
										${rocketSvg}
									</div>
									<h3>GPU-Accelerated</h3>
								</div>
								<div class="feature-content">
									<p class=small>Blazing fast performance with WebGL for smooth transitions even in 4K</p>
								</div>
							</div>
						</div>
						
						<div class="transitions-cta">
							<a href="#/editor" class="try transitions-button">Try Transitions Now</a>
							<a href="https://gl-transitions.com/gallery" target="_blank" class="transitions-link">
								View All Transitions ${externalLinkSvg}
							</a>
						</div>
					</div>
					
					<div class="transitions-demo">
						<div class="video-container">
							<video class="transitions-video" autoplay loop muted>
								<source src="/assets/transitions.mp4" type="video/mp4" />
							</video>
							<div class="transition-counter">
								<span class="current-transition">Transition: <strong>${this.currentTransition}</strong></span>
								<span class="transition-count">1/30</span>
							</div>
						</div>
						
						<div class="transitions-gallery">
							${transitions.slice(0, 5).map((transition, i) => {
								const paddedIndex = i.toString().padStart(3, '0');
								return html`
									<div
										@click=${this.setCurrentTransition}
										class="transition-thumbnail ${this.currentTransition === transition ? "active" : ""}"
										data-index=${i} data-name=${transition}
									>
										<img src="/assets/transitions/output_${paddedIndex}.gif"/>
									</div>
								`})}
							<div class="transition-thumbnail more-transitions" @click=${this.toggleTransitionsDropdown}>
								+62 more
								<div class="transitions-dropdown" ?data-open=${this.transitionsDropdownOpen}>
									<div class="dropdown-grid">
										${transitions.slice(5).map((transition, i) => {
											const index = i + 5
											const paddedIndex = index.toString().padStart(3, '0');
											return html`
												<div
													@click=${this.setCurrentTransition}
													class="transition-thumbnail ${this.currentTransition === transition ? "active" : ""}"
													data-index=${i + 5} data-name=${transition}
												>
													<img src="/assets/transitions/output_${paddedIndex}.gif"/>
												</div>
											`})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			<!-- Features Section -->
			<section id="features" class="differences">
				<div class="items">
					<div class="flex">
						<div class="item open">
							<h3>Open source</h3>
							<div class="gh">
								<a href="https://github.com/omni-media/omniclip" class="flex">
									<span class="btn btn-github">View on GitHub</span>
									<img class="stars" src="https://img.shields.io/github/stars/omni-media/omniclip" alt="GitHub Stars">
								</a>
							</div>
							<p>
								Yep, it's open source! See how it's built, tweak it,
								or pitch in, all with the freedom of an MIT license.
							</p>
							<img src="/assets/opens.png" />
						</div>
						<div class="item free">
							<h3>Free</h3>
							<p>
								Totally free, no strings attached.
								Use it, create with it, and enjoy no hidden costs or sneaky subscriptions.
							</p>
							<span class="emoji-1">
								&#127775;
							</span>
							<span class="emoji-2">
								&#127775;
							</span>
							<div class="view">
								<a
									class="try"
									href="#/editor"
								>
									Open editor
								</a>
							</div>
						</div>
					</div>
					<div class="flex">
						<div class="item more">
							<h3>Privacy</h3>
							<p>
								Your data stays yours, everything happens locally on your device.
							</p>
							${lockSvg}
						</div>
						<div class="item more">
							<h3>Security</h3>
							<p>No uploads, no risks. Everything runs safely within your browser.</p>
							${shieldSvg}
						</div>
						<div class="item more">
							<h3>Client side</h3>
							<p>
								Powered by WebCodecs for native-speed rendering and export.
							</p>
							${computerSvg}
						</div>
					</div>
				</div>
			</section>

			<!-- Coming Soon Section -->
			<section id="coming-soon" class="coming-soon">
				<div class="coming-soon-header">
					<h2>Coming Soon <span class="feature-badge">New Features</span></h2>
					<p>We're constantly improving Omniclip with powerful new features to make your video editing experience even better.</p>
				</div>
				
				<div class="coming-soon-container">
					<!-- Keyframes Feature -->
					<div class="coming-soon-feature">
						<div class="feature-content">
							<div class="flex">
								<div class="feature-icon-large">${keyframesSvg}</div>
								<h3>Keyframes</h3>
							</div>
							<p>
								Take precise control over your animations with powerful keyframe editor.
								Create smooth transitions, complex movements, and professional effects with ease.
							</p>
							<ul class="feature-list">
								<li>Multi-property animation</li>
								<li>Customizable easing functions</li>
								<li>Visual keyframe timeline</li>
								<li>Copy and paste keyframes</li>
							</ul>
						</div>
					</div>
					
					<!-- Speech to Text Feature -->
					<div class="coming-soon-feature">
						<div class="feature-content">
							<div class="flex">
								<div class="feature-icon-large">${speechToTextSvg}</div>
								<h3>Speech to Text</h3>
							</div>
							<p>
								Automatically generate accurate captions for your videos with built-in speech recognition. 
								Save hours of manual transcription work and make your content more accessible.
							</p>
							<ul class="feature-list">
								<li>Automatic caption generation</li>
								<li>Multiple language support</li>
								<li>Editable transcript</li>
								<li>Caption styling options</li>
							</ul>
						</div>
					</div>
				</div>

				
				<div class="coming-soon-cta">
					<a href="#" class="notify-link">
						<span>Get Notified When Available</span>
						${bellSvg}
					</a>
					<a href="https://github.com/omni-media/omniclip" target="_blank" class="github-link">
						<span>Follow Development on GitHub</span>
						${githubSvg}
					</a>
				</div>
			</section>


			<section class="developers" id="developers">
				<h2>For developers <span class="coming-soon-badge">Coming Soon</span></h2>
				<p class="section-intro">
					Take full control of Omniclip projects through code, automation, or CI/CD pipelines.
				</p>

				<div class="dev-features-grid">
					<!-- Omni Tools API Feature -->
					<div class="dev-feature-card">
						<div class="feature-header">
							<h3>Omni Tools API</h3>
						</div>
						<div class="feature-content">
							<ul class="feature-list">
								<li>Modular library for code-driven video editing</li>
								<li>Powerful core with CLI, timeline format, and templates integration</li>
							</ul>

							<!-- Core Code Preview -->
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
						</div>
					</div>
				</div>

				<div class="dev-cta">
					<a href="#" class="notify-link">
						<span>Get Notified When Available</span>
						${bellSvg}
					</a>
					<a href="https://github.com/omni-media/omnitool" target="_blank" class="github-link">
						<span>Follow Development on GitHub</span>
						${githubSvg}
					</a>
				</div>
			</section>


			
			<!-- Footer -->
			<footer>
				<div class="footer-logo-background">
					<img src="/assets/icon3.png" alt="Omniclip" />
				</div>
				
				<div class="footer-content">
					<!-- <div class="footer-main"> -->
					<!-- 	<span>Copyright © 2024 Omniclip All Rights Reserved.</span> -->
					<!-- 	<div class="footer-links"> -->
					<!-- 		<a>Terms & Conditions</a> -->
					<!-- 		<a>Privacy Policy</a> -->
					<!-- 	</div> -->
					<!-- </div> -->
					<div class="creator-credit">
						<span>Made by Przemek Gałęzki</span>
						<a href="https://github.com/zenkyuv" class="github-link" target="_blank">
							<span>Github</span>
							${githubSvg}
						</a>
					</div>
				</div>
			</footer>
		</div>
	`
}}
