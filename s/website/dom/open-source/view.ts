import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const OpenSource = shadowView(use => () => {
  use.styles(themeCss, styleCss)

  return html`
    <section class="open-source">
      <h2>Open Source</h2>
      <p class="subtitle">Omniclip is fully open source. Every line of code<br>is public and freely available.</p>

      <div class="row">
        <div class="license">
          <span class="badge">MIT LICENSE</span>
          <ul>
            <li>Free for personal and commercial use</li>
            <li>Permission to modify and distribute</li>
            <li>No obligation to disclose source</li>
            <li>Comes with no warranty</li>
          </ul>
        </div>

        <div class="text">
          <a href="https://github.com/omni-media/omniclip" target="_blank" rel="noopener">
            <img src="https://img.shields.io/github/stars/omni-media/omniclip?style=social" alt="GitHub stars"/>
          </a>
          <p>
            Every line of code is public — from<br>
            the editor engine to the export<br>
            pipeline. Fork it, audit it, contribute.<br>
            Built for developers, by developers.
          </p>
          <a class="btn github" href="https://github.com/omni-media/omniclip" target="_blank" rel="noopener">
            <sl-icon name="github"></sl-icon> View on GitHub
          </a>
        </div>
      </div>

      <!-- Contributors pill -->
      <div class="contributors">
        <div class="contributors-card" role="list" aria-label="Project contributors">
          <span class="contributors-label">Contributors</span>

          <div class="avatar-group">
            <!-- Replace href/src with real profiles/avatars -->
            <a class="avatar" role="listitem" href="https://github.com/zenkyuv" target="_blank" rel="noopener" title="Przemek Galezki">
              <img src="https://avatars.githubusercontent.com/u/79974168?v=4" alt="Przemek Galezki"/>
            </a>

            <a class="avatar" role="listitem" href="https://github.com/chase-moskal" target="_blank" rel="noopener" title="Chase Moskal">
              <img src="https://avatars.githubusercontent.com/u/7145590?v=4" alt="Chase Moskal"/>
            </a>

            <!-- example with initials fallback (no image) -->
            <a class="avatar avatar--initials" role="listitem" href="https://github.com/your-contributor" target="_blank" rel="noopener" title="Alex Doe" data-initials="AD"></a>

            <a class="avatar avatar--initials" role="listitem" href="https://github.com/your-contributor-2" target="_blank" rel="noopener" title="Sam Roe" data-initials="SR"></a>

            <!-- “+X” link to all contributors -->
            <a class="avatar avatar--more" role="listitem" href="https://github.com/omni-media/omniclip/graphs/contributors" target="_blank" rel="noopener" title="View all contributors">+42</a>
          </div>
        </div>
      </div>
    </section>
  `
})

