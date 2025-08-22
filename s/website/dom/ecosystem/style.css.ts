import {css} from "@benev/slate"

export default css`
.ecosystem {
  --bg: #141110;
  --surface: #1B1816;
  --text: #E9E4DE;
  --text-muted: #CFC9C2;
  --border: rgba(233,228,222,0.14);
  --card: rgba(233,228,222,0.06);
  --card-hover: rgba(233,228,222,0.08);
  --accent: #E0B26E;
  --ring: rgba(224,178,110,0.35);
  --shadow: rgba(0,0,0,0.55);

  padding: 7rem 1rem;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  color: var(--text);
}

/* headings + subtitle */
.ecosystem h2 {
  font-family: Inter, Georgia, serif;
  font-weight: 800;
  letter-spacing: -0.01em;
  font-size: clamp(2rem, 1.25rem + 3vw, 3rem);
  margin: 0 0 .5rem 0;
}

.ecosystem .subtitle {
  color: var(--text-muted);
  font-family: Inter, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 3rem 0;
  max-width: 720px;
  margin-inline: auto;
}

.ecosystem .subtitle .credit {
  color: rgba(233,228,222,0.6);
  font-style: italic;
  font-size: .92em;
}

.ecosystem .subtitle a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color .15s ease, text-decoration-color .15s ease;
}
.ecosystem .subtitle a:hover {
  color: #f0c27f;
}

/* group titles (@omnistudio / @e280) */
.libraries {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}
.group-title {
  display: inline-flex;
  align-items: center;
  gap: .6em;
  justify-content: center;

  font-family: "Playfair Display", Georgia, serif;
  font-weight: 800;
  letter-spacing: -.005em;
  color: var(--text);
  margin: 0 0 .4rem 0;
}
.group-title img {
  width: 30px; height: 30px;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0,0,0,.35);
}

/* grid */
.ecosystem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.6rem;
  margin-top: 1rem;
}

/* cards */
.eco-item {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 1.35rem;
  text-align: left;

  background: var(--card);
  border: 1px solid var(--border);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 26px var(--shadow), 0 0 0 1px rgba(0,0,0,0.25) inset;
  transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease, border-color .15s ease;
  text-decoration: none;
  color: inherit;
}

.eco-item:hover {
  background: var(--card-hover);
  border-color: rgba(233,228,222,0.2);
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,0.22) inset;
}

/* top image / watermark */
.eco-item .item-background {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.18;
  filter: saturate(.9) contrast(.95);
  transition: opacity .28s ease, filter .28s ease, transform .3s ease;
}
.eco-item:hover .item-background {
  opacity: 0.28;
  filter: saturate(1.05) contrast(1);
  transform: scale(1.02);
}

/* titles + body */
.eco-item h3 {
  display: inline-flex;
  align-items: center;
  gap: .5em;

  margin: 0 0 .4rem 0;
  font-family: Inter, Georgia, serif;
  font-weight: 800;
  letter-spacing: -.005em;
  font-size: 1.25rem;
  color: var(--text);
}
.eco-item .item-icon {
  width: 22px; height: 22px; border-radius: 5px;
}

.eco-item p {
  margin: 0;
  padding: .2em 0;
  font-family: system-ui, sans-serif;
  font-size: .98rem;
  line-height: 1.55;
  color: var(--text-muted);
  text-shadow: 0 1px 1px rgba(0,0,0,.3);
}

/* focus states for a11y */
.eco-item:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px var(--ring),
    0 10px 26px var(--shadow),
    0 0 0 1px rgba(0,0,0,0.25) inset;
}

/* small screens */
@media (max-width: 720px) {
  .ecosystem { padding: 5.5rem 1rem; }
  .group-title { font-size: 1.2rem; }
  .eco-item { padding: 1.1rem; border-radius: 14px; }
}
`

