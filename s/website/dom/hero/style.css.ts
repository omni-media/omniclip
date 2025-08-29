
import {css} from "@benev/slate"

export default css`

:host, .hero {
  --bg: #141110;           /* espresso */
  --surface: #1B1816;      /* cards/surfaces if needed */
  --grid: rgba(233,228,222,0.05); /* warm grid lines */
  --text: #E9E4DE;         /* warm off-white */
  --text-muted: #CFC9C2;   /* secondary copy */
  --text-dim: rgba(233,228,222,0.65);
  --accent: #E0B26E;       /* gold */
  --accent-ink: #1a1613;   /* dark text on gold */
  --ring: rgba(224,178,110,0.35);
}

.hero {
  position: relative;
  min-height: 100vh;
  height: 600px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  color: var(--text);
  background-color: var(--bg);

  background-image:
    linear-gradient(to bottom, var(--grid) 1px, transparent 1px),
    linear-gradient(to right,  var(--grid) 1px, transparent 1px);
  background-size: 64px 64px, 64px 64px;
  background-position: 0 0, 0 0;
  z-index: 0;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 60% at 50% 45%,
      rgba(255,255,255,0.05) 0%,
      rgba(255,255,255,0.00) 55%),
    linear-gradient(to bottom, rgba(0,0,0,0) 75%, var(--bg) 100%);
  pointer-events: none;
  z-index: 1;
}


.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: 100%;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
}

.omniclip-title {
  display: inline-flex;
	flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 800;
  font-size: 4.25rem;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--text);
  margin: 0 0 0.6rem 0;
}

.omniclip-title img {
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
}

.version-tag {
  position: absolute;
  top: -1.6em;
  right: 7.5em;

  background: rgba(233,228,222,0.06);
  border: 1px solid rgba(233,228,222,0.14);
  color: var(--text-dim);

  border-radius: 6px;
  padding: 0.22em 0.5em;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 600;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
  pointer-events: none;
}

/* copy */
.hero-content .tagline {
  font-size: 1rem;
  letter-spacing: 0.03em;
  color: var(--text-dim);
  margin-bottom: 0.25rem;
}

.subheadline {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 3.8em;
  position: relative;
}

/* warm divider */
.subheadline::after {
  content: "";
  position: absolute;
  bottom: -1.8rem;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 3px;
  background: var(--accent);
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(224,178,110,0.12);
}

/* ===== Buttons ===== */
.buttons {
  display: flex;
  gap: 0.9em;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65em;

  padding: 0.8em 1.4em;
  border-radius: 10px;
  text-decoration: none;

  font-family: Inter, system-ui, sans-serif;
  font-weight: 600;
  font-size: 1rem;

  transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease, color 120ms ease, border-color 120ms ease;
  will-change: transform;
}

/* Primary */
.btn.editor {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 0 8px 20px rgba(224,178,110,0.18);
}
.btn.editor:hover {
  background: #d7a761;
  box-shadow: 0 10px 22px rgba(224,178,110,0.24);
  transform: translateY(-1px);
}

/* Secondary */
.btn.discord {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(233,228,222,0.18);
  box-shadow: 0 6px 14px rgba(0,0,0,0.25) inset;
}
.btn.discord:hover {
  background: rgba(233,228,222,0.06);
  border-color: rgba(233,228,222,0.28);
  box-shadow: 0 6px 14px rgba(0,0,0,0.18) inset, 0 0 0 3px var(--ring);
  transform: translateY(-1px);
}
.btn.discord sl-icon {
  font-size: 20px;
  margin-top: 1px;
}

@media (max-width: 768px) {
	.omniclip-title img {
		width: 440px;
	}
	.omniclip-title .version-tag {
		right: auto;
		top: -4em;
	}
}

@media (max-width: 480px) {
	.omniclip-title img {
		width: 90%;
	}
	.subheadline {
		font-size: 1rem;
	}
}
`
