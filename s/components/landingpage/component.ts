import {LitElement, html} from "lit"
import {property} from "lit/decorators.js"

import styles from "./styles.js"
import {removeLoadingPageIndicator} from "../../main.js"
import lockSvg from "../../icons/gravity-ui/lock.svg.js"
import shieldSvg from "../../icons/gravity-ui/shield.svg.js"
import discordSvg from "../../icons/remix-icon/discord.svg.js"
import computerSvg from "../../icons/remix-icon/computer.svg.js"
import arrowRightSvg from "../../icons/gravity-ui/arrow-right.svg.js"
import circleInfoSvg from "../../icons/gravity-ui/circle-info.svg.js"

export class LandingPage extends LitElement {
	static styles = styles

	@property({type: Boolean})
	menuOpened = false

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

	connectedCallback() {
	  super.connectedCallback()
		window.addEventListener("click", this.menuClick)
		removeLoadingPageIndicator()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener("click", this.menuClick)
	}

	firstUpdated() {
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
					<a @click=${() => this.scrollIntoElementView("capabilities")} href="#capabilities">Capabilities</a>
					<a @click=${() => this.scrollIntoElementView("soon")} href="#soon">Soon</a>
					<a
						class="try"
						href="#/editor"
					>
						Try it out ${arrowRightSvg}
					</a>
				</div>
				<div class="nav">
					<a @click=${() => this.scrollIntoElementView("welcome")} href="#welcome">Home</a>
					<a @click=${() => this.scrollIntoElementView("capabilities")} href="#capabilities">Capabilities</a>
					<a @click=${() => this.scrollIntoElementView("soon")} href="#soon">Soon</a>
					<a
						class="try"
						href="#/editor"
					>
						Try it out ${arrowRightSvg}
					</a>
				</div>
			</nav>
			<section id="welcome" class="welcome">
				<p>video editor on the web</p>
				<h1>
					<span>If you are tired of paying to use</span>
					<span>all the features of existing</span>
					<span>video editing applications then</span>
					<span> you might have found a gem! </span>
				</h1>
				<h2>
					<span
						>Turns out omniclip is fully free and on top of that its</span
					>
					<span
						>open source. Everything works inside browser, theres</span
					>
					<span
						>no private data being used, everything is kept within</span
					>
					<span>your device disk space."</span>
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
			<section id="capabilities" class="abilities">
				<h2>Capabilities</h2>
				<div class=items>
					<h4>All the basic stuff, you can add audio/image/text/video and trim or split it, but theres more!</h4>
					<div class=flex>
						<div class=item>
							<img src="/assets/trim.svg" />
							<p>Trim</p>
						</div>
						<div class=item>
							<img src="/assets/split.svg" />
							<p>Split</p>
						</div>
						<div class=item>
							<img src="/assets/text.svg" />
							<p>Text</p>
						</div>
						<div class=item>
							<img src="/assets/images.svg" />
							<p>Images</p>
						</div>
						<div class=item>
							<img src="/assets/audio.svg" />
							<p>Audio</p>
						</div>
					</div>
					<div class=more>
						<div class=flex>
							<div class="item-more">
								<h3>Animations</h3>
								<p>7 animations to play with<br>
								but theres more to come!</p>
								<video autoplay loop muted width="250">
									<source src="/assets/animation.mp4" type="video/mp4" />
								</video>
							</div>
							<div class="item-more">
								<h3>Filters</h3>
								<p>As much as 18 filters!<br> you can mix and match them too.</p>
								<video autoplay loop muted width="250">
									<source src="/assets/filters.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
						<div class=flex>
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
					<div class=export>
						<div>
							<h3>Export your video up to 4k!</h3>
							<ul>
								<li>No credit card required! <span class=emoji>&#129327;</span></li>
								<li>Unparalleled speed <span class=emoji>&#9889;</span></li>
								<li>Choose desired bitrate & aspect ratio <span class=emoji>&#9881;</span></li>
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
			<section class="differences">
				<div class=items>
					<div class=flex>
						<div class="item open">
							<h3>Open source</h3>
							<div class=gh>
								<a href="https://github.com/omni-media/omniclip" class="flex">
									<span class="btn btn-github">View on GitHub</span>
									<img class="stars" src="https://img.shields.io/github/stars/omni-media/omniclip" alt="GitHub Stars">
								</a>
							</div>
							<p>
								Yep, it’s open source! See how it’s built, tweak it,
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
							<span class=emoji-1>
								&#127775;
							</span>
							<span class=emoji-2>
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
					<div class=flex>
						<div class="item more">
							<h3>Privacy</h3>
							<p>
								Your data stays yours, everything happens locally on your device,
								so nothing gets sent to a server.
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
								Powered by WebCodecs for native-speed rendering and export,
								all processing happens right on your device.
							</p>
							${computerSvg}
						</div>
					</div>
				</div>
			</section>
			<section class="soon" id="soon">
				<h2>Coming soon</h2>
				<div class="items">
					<div class=flex>
						<div class="item">
							<div class="img-box">
								<img src="/assets/transition.svg" />
							</div>
							<h3>Transitions</h3>
							<p>transitions between clips</p>
						</div>
						<div class="item">
							<div class="img-box"><img src="/assets/effect.svg" /></div>
							<h3>Collaboration</h3>
							<p>Work together in real-time</p>
						</div>
					</div>
					<div class="item">
						<h3 class=h3-api>Omni tools</h3>
						<p class=p-api>
							Whether you want to harness the raw power of video processing or script entire timelines without a UI,
							Omniclip is set to become your go-to toolkit for building, creating, and innovating anything video-related on the web.
						</p>
						<div class="flex api">
							<div class=concepts>
								<div class=concept>
									<span>${circleInfoSvg} concept</span>
									<img src="/assets/codesample2.png" />
								</div>
								<div class=concept>
									<span>${circleInfoSvg} concept</span>
									<img src="/assets/codesample1.png" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<footer>
				<span>Copyright © 2024 Omniclip All Rights Reserved.</span>
				<div>
					<a>Terms & Conditions</a>
					<a>Privacy Policy</a>
				</div>
			</footer>
		</div>
	`
}}
