import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Features = shadowView(use => () => {
	use.styles(themeCss, styleCss)

	return html`
		<section class="features">
  		<div>
    		<h2>Features</h2>
    		<p>Add audio, images, text, video, trim, split & more.</p>
  		</div>
  		<div class="feature-grid">
    		<div class="feature-card animations">
      		<h3>Animations</h3>
      		<p>7 animations to play with.</br> more on the way.</p>
					<video autoplay loop src="/assets/animation.mp4"></video>
    		</div>
    		<div class="feature-card filters">
      		<h3>Filters</h3>
      		<p>As much as 30+ filters!<br>you can mix and match them too.</p>
					<video autoplay loop src="/assets/filters.mp4"></video>
				</div>
    		<div class="feature-card transitions">
					<div class=box>
						<div>
      				<h3>Community-Driven Transitions</h3>
      				<p>Powered by GL Transitions, a collection of GLSL transitions created by developers worldwide.</p>
						</div>
						<div>
							<h3>Open Source Transitions</h3>
							<p>Access to 60+ high-quality transitions created and maintained by the community</p>
						</div>
						<div>
							<h3>GPU-Accelerated</h3>
							<p>Blazing fast performance with WebGL for smooth transitions even in 4K</p>
						</div>
					</div>
					<video autoplay loop src="/assets/transitions.mp4"></video>
				</div>
    		<div class="feature-card fonts">
      		<h3>Local Fonts</h3>
      		<p>Auto-loading fonts from<br> your device for seamless typography.</p>
				</div>
    		<div class="feature-card export">
      		<h3>Fast export</h3>
      		<p>By using newest web tech<br> this video editor has fastest export.</p>
				</div>
    		<div class="feature-card files">
					<h3>Large Files</h3>
					<p>Handles massive files with ease.<br>Only what’s needed is loaded — the rest stays out of memory.</p>
				</div>
  		</div>
		</section>
	`
})
