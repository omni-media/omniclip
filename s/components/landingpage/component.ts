import { html } from "@benev/slate"

import { light_component } from "../../context/context.js"
import discordSvg from "../../icons/remix-icon/discord.svg.js"

export const LandingPage = light_component((use) => {
	use.watch(() => use.context.state)
	const texts = ["always free", "open source", "easy to use", "fast & secure"]
	const [editorOpened, setEditorOpened] = use.state(false)
	const [_text, setText] = use.state("always free")
	const [activeText, setActiveText] = use.state(0)

	use.mount(() => {
		const interval = setInterval(() => {
			setActiveText(activeText + 1)
			if (activeText === 4) {
				setActiveText(0)
			}
			setText(texts[activeText])
		}, 3000)
		return () => clearInterval(interval)
	})

	return html`
		${editorOpened
			? html` <construct-editor></construct-editor> `
			: html`
					<div class="landing-page">
						<section class="welcome">
							<img class="logo" src="/assets/icon3.png" />
							<p class="header-text">
								<span class="word-switch">
									<span class="switch">always free</span>
									<span class="switch">open source</span>
									<span class="switch">easy to use</span>
									<span class="switch">fast & secure</span>
								</span>
								video editor on the web
							</p>
							<div class="btns">
								<button
									class="try"
									@click=${() => setEditorOpened(!editorOpened)}
								>
									Try it out
								</button>
								<a
									href="https://discord.gg/Nr8t9s5wSM"
									class="discord"
									target="_blank"
								>
									${discordSvg} Join Discord
								</a>
							</div>
						</section>
						<section class="core">
							<h2>Core principles behind this video editor</h2>
							<div class="items">
								<div class="item">
									<h3>Performance</h3>
									<p>
										By leveraging cutting-edge technologies (webcodecs), this video editor delivers unparalleled speed and efficiency.
										Experience the fastest exporting capabilities available on the web.
									</p>
								</div>
								<div class="item">
									<h3>Security</h3>
									<p>
										This video editor operates entirely client-side, meaning all your editing processes and data storage occur locally on your device.
										There is no need for login or registration,
										ensuring your personal information remains private. 
									</p>
								</div>
								<div class="item">
									<h3>Ease of use</h3>
									<p>
										Designed with the user in mind, this video editor features an intuitive and user-friendly interface.
										Its simple layout and straightforward tools make it accessible for beginners.
									</p>
								</div>
							</div>
						</section>
						<section class="capabilities">
							<h2>
								What is this video editor<br />
								capable of
							</h2>
							<div class="items">
								<div class="item">
									<h3>Trim</h3>
									<p>
										Easily remove unwanted sections from your video clips with the trimming tool
									</p>
								</div>
								<div class="item">
									<h3>Audio</h3>
									<p>Enhance your videos by adding custom audio tracks</p>
								</div>
								<div class="item">
									<h3>Images</h3>
									<p>Add all kinds of images to your timeline with ease</p>
								</div>
								<div class="item">
									<h3>Text</h3>
									<p>Add text anywhere on your video clips or images</p>
								</div>
								<div class="item">
									<h3>High Resolution</h3>
									<p>Export project with support for resolutions up to 4K</p>
								</div>
								<div class="item">
									<h3>Split</h3>
									<p>Divide your video clips into multiple segments with ease using the split tool.</p>
								</div>
							</div>
						</section>
						<section class="soon">
							<h2>Coming soon</h2>
							<div class="items">
								<div class="item">
									<h3>Transitions</h3>
									<p>
										Applying transitions between video clips for smooth visual
										effects
									</p>
								</div>
								<div class="item">
									<h3>Effects</h3>
									<p>
										Filters, color adjustments, or some other special effects
									</p>
								</div>
							</div>
						</section>
					</div>
				`}
	`
})
