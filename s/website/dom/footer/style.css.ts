import {css} from "@benev/slate"

export default css`
.footer {
  --bg: #141110;                        /* espresso */
  --surface: #1B1816;
  --grid: rgba(233,228,222,0.05);       /* warm grid */
  --text: #E9E4DE;
  --text-dim: rgba(233,228,222,0.72);
  --border: rgba(233,228,222,0.14);
  --accent: #E0B26E;                    /* gold */
  --accent-ink: #1a1613;
  --ring: rgba(224,178,110,0.35);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 360px;
  margin-top: 5em;
  overflow: hidden;
  color: var(--text);

  background-color: var(--bg);
  background-image:
    linear-gradient(to bottom, var(--grid) 1px, transparent 1px),
    linear-gradient(to right,  var(--grid) 1px, transparent 1px);
  background-size: 64px 64px, 64px 64px;
  background-position: 0 0, 0 0;
}

/* soft vignette */
.footer::before {
  content: "";
  position: absolute;
  inset: -50px;
	margin-top: 3em;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(60% 60% at 50% 40%,
      rgba(255,255,255,0.05) 0%,
      rgba(255,255,255,0) 60%),
    linear-gradient(to top, rgba(0,0,0,0) 78%, var(--bg) 100%);
}

/* giant watermark wordmark */
.logo {
  position: absolute;
	opacity: 0.5;
	text-shadow: 1px 1px 10px #221c1c73;
  z-index: 1;
  font-family: sans-serif;
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: clamp(4rem, 14vw, 12rem);
  line-height: 1;

  color: transparent;
  -webkit-text-stroke: 1px rgba(233,228,222,0.12);
  user-select: none;
  pointer-events: none;
}

/* center content */
.creator-credit {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .9em;
  text-align: center;

  color: var(--text);
  padding: 0 1rem;
}

.creator-credit .name {
  font-family: Inter, system-ui, sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-dim);
}

.github-links {
  display: flex;
  gap: .75em;
  flex-wrap: wrap;
  justify-content: center;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: .45em;

  background: var(--accent);
  color: var(--accent-ink);
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
  border-radius: 999px;
  padding: .45em .9em;

  font-family: Inter, system-ui, sans-serif;
  font-weight: 700;
  font-size: .9rem;
  text-decoration: none;

  box-shadow: 0 6px 16px rgba(224,178,110,0.2);
  transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease, border-color .12s ease;
}
.github-link:hover {
  background: #d7a761;
  border-color: color-mix(in oklab, #d7a761 65%, black);
  box-shadow: 0 8px 20px rgba(224,178,110,0.26);
  transform: translateY(-1px);
}
.github-link sl-icon { font-size: 18px; }

/* ambient glow puck */
.glow {
  position: absolute;
  z-index: 1;
  width: clamp(220px, 40vw, 520px);
  height: clamp(140px, 24vw, 320px);
  border-radius: 50%;

  background: conic-gradient(
    from 180deg,
    #1a1613 0deg,
    #1a1613 140deg,
    #141110 200deg,
    #1a1613 300deg,
    #141110 360deg
  );
  filter: blur(38px) saturate(1.05);
  opacity: .7;
}

/* responsive */
@media (max-width: 720px) {
  .footer {
		height: 300px;
		margin-top: 0;
	}
  .creator-credit .name { font-size: .95rem; }
  .github-link { padding: .45em .85em; font-size: .92rem; }
}
`

