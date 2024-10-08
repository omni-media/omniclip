import {LitElement, html} from "lit"
import {property} from "lit/decorators.js"

import styles from "./styles.js"
import {removeLoadingPageIndicator} from "../../main.js"
import discordSvg from "../../icons/remix-icon/discord.svg.js"

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
					<a @click=${() => this.scrollIntoElementView("core")} href="#core">Principles</a>
					<a @click=${() => this.scrollIntoElementView("capabilities")} href="#capabilities">Capabilities</a>
				</div>
				<div class="nav">
					<a @click=${() => this.scrollIntoElementView("welcome")} href="#welcome">Home</a>
					<a @click=${() => this.scrollIntoElementView("core")} href="#core">Core Principles</a>
					<a @click=${() => this.scrollIntoElementView("capabilities")} href="#capabilities">Capabilities</a>
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
						Try it out
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
			<section id="core" class="core">
				<div class="ellipse-1"></div>
				<div class="ellipse-2"></div>
				<h2>
					<span>Core principles behind</span>
					<span>this video editor<span>
				</h2>
				<div class="items">
					<div class="item">
						<img src="/assets/performance.svg" />
						<div>
							<h3>Performance</h3>
							<p>
								By leveraging cutting-edge technologies (webcodecs), this
								video editor delivers unparalleled speed and efficiency.
								Experience the fastest exporting capabilities available on
								the web.
							</p>
						</div>
					</div>
					<div class="item">
						<img src="/assets/secure.svg" />
						<div>
							<h3>Security</h3>
							<p>
								This video editor operates entirely client-side, meaning
								all your editing processes and data storage occur locally
								on your device. There is no need for login or
								registration, ensuring your personal information remains
								private.
							</p>
						</div>
					</div>
					<div class="item">
						<img src="/assets/ease.svg" />
						<div>
							<h3>Ease of use</h3>
							<p>
								Designed with the user in mind, this video editor features
								an intuitive and user-friendly interface. Its simple
								layout and straightforward tools make it accessible for
								beginners.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section id="capabilities" class="capabilities">
				<h2>Capabilities</h2>
				<div class="items">
					<div class="item">
						<div class="img-box"><img src="/assets/trim.svg" /></div>
						<h3>Trim</h3>
						<p>
							Easily remove unwanted sections from your
							video clips with the trimming tool
						</p>
					</div>
					<div class="item">
						<div class="img-box"><img src="/assets/audio.svg" /></div>
						<h3>Audio</h3>
						<p>
							Enhance your videos by adding custom
							audio tracks
						</p>
					</div>
					<div class="item">
						<div class="img-box"><img src="/assets/images.svg" /></div>
						<h3>Images</h3>
						<p>
							Add all kinds of images to your timeline
							with ease
						</p>
					</div>
					<div class="item">
						<div class="img-box"><img src="/assets/text.svg" /></div>
						<h3>Text</h3>
						<p>
							Add text anywhere on your video clips or
							images
						</p>
					</div>
					<div class="item">
						<div class="img-box"><img src="/assets/high-res.svg" /></div>
						<h3>High Resolution</h3>
						<p>
							Export project with support for resolutions up
							to 4K
						</p>
					</div>
					<div class="item">
						<div class="img-box"><img src="/assets/split.svg" /></div>
						<h3>Split</h3>
						<p>
							Divide your video clips into multiple
							segments with ease using the split tool.
						</p>
					</div>
				</div>
			</section>
			<section class="soon">
				<div class="ellipse-1"></div>
				<div class="ellipse-2"></div>
				<div class="ellipse-3"></div>
				<h2>Coming soon</h2>
				<div class="items">
					<div class="item">
						<div class="img-box">
							<img src="/assets/transition.svg" />
						</div>
						<h3>Transitions</h3>
						<p>
							Applying transitions between video clips for smooth visual
							effects
						</p>
					</div>
					<div class="item">
						<div class="img-box"><img src="/assets/effect.svg" /></div>
						<h3>Effects</h3>
						<p>
							Filters, color adjustments, or some other special effects
						</p>
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
