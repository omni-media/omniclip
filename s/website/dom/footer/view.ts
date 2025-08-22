import {html, shadowView} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../../editor/theme.css.js"

export const Footer = shadowView(use => () => {
  use.styles(themeCss, styleCss)

  return html`
    <footer class="footer">
      <div class="glow"></div>

      <div class="creator-credit">
        <span class="name">Made by</span>
        <div class="github-links">
          <a
            class="github-link"
            href="https://github.com/zenkyuv"
            target="_blank"
            rel="noopener"
            aria-label="Przemek on GitHub"
          >
            <sl-icon name="github"></sl-icon>
            <span>@zenkyu</span>
          </a>
          <a
            class="github-link"
            href="https://github.com/chase-moskal"
            target="_blank"
            rel="noopener"
            aria-label="Chase on GitHub"
          >
            <sl-icon name="github"></sl-icon>
            <span>@chase-moskal</span>
          </a>
        </div>
      </div>

      <span class="logo">OMNICLIP</span>
    </footer>
  `
})
