import {css} from "@benev/slate"

export default css`
/* tokens aligned with the hero/nav espresso palette */
.open-source {
  --bg: #141110;
  --surface: #1B1816;
  --text: #E9E4DE;
  --text-muted: #CFC9C2;
  --border: rgba(233,228,222,0.14);
  --card: rgba(233,228,222,0.06);
  --card-hover: rgba(233,228,222,0.08);
  --accent: #E0B26E;
  --accent-ink: #1a1613;
  --shadow: rgba(0,0,0,0.55);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5.5rem 1rem;
  color: var(--text);
  text-align: center;
}

/* heading + subtitle */
.open-source h2 {
  font-family: Inter, Georgia, serif;
  font-weight: 800;
  letter-spacing: -0.01em;
  font-size: clamp(2rem, 1.25rem + 3vw, 3rem);
  margin: 0 0 .5rem 0;
  color: var(--text);
}

.open-source .subtitle {
  margin: 0 0 3rem 0;
  color: var(--text-muted);
  line-height: 1.5;
  font-family: Inter, system-ui, sans-serif;
  font-size: 1rem;
}

/* layout */
.row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* license card */
.license {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.8rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 26px var(--shadow), 0 0 0 1px rgba(0,0,0,0.25) inset;
  text-align: left;
}

.badge {
  display: inline-block;
  align-self: start;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 700;
  font-size: .8rem;
  letter-spacing: .08em;
  text-transform: uppercase;

  color: var(--accent-ink);
  background: var(--accent);
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
  border-radius: 999px;
  padding: .35em .7em;
  box-shadow: 0 6px 16px rgba(224,178,110,0.22);
}

/* checklist */
.license ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: .5rem;
  color: var(--text-muted);
  font-family: system-ui, Inter, sans-serif;
  font-size: .98rem;
  line-height: 1.55;
}
.license ul li {
  position: relative;
  padding-left: 1.6rem;
}
.license ul li::before {
  content: "";
  position: absolute;
  left: 0; top: .20rem;
  width: 1rem; height: 1rem;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(224,178,110,0.18);
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.285 2.859l1.414 1.414-12.02 12.02-6.364-6.364 1.414-1.414 4.95 4.95z"/></svg>') center / 70% 70% no-repeat;
}

/* right column */
.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  text-align: left;
}

.text p {
  font-family: Inter, system-ui, sans-serif;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

/* CTA button – matches site primary button */
.btn.github {
  display: inline-flex;
  align-items: center;
  gap: .6em;

  font-family: Inter, system-ui, sans-serif;
  font-weight: 700;
  font-size: .98rem;
  text-decoration: none;

  background: var(--accent);
  color: var(--accent-ink);
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
  border-radius: 10px;
  padding: .75em 1.2em;

  box-shadow: 0 8px 20px rgba(224,178,110,0.20);
  transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease, border-color .12s ease;
  width: fit-content;
}
.btn.github:hover {
  background: #d7a761;
  border-color: color-mix(in oklab, #d7a761 65%, black);
  box-shadow: 0 10px 24px rgba(224,178,110,0.26);
  transform: translateY(-1px);
}
.btn.github sl-icon {
  font-size: 18px;
  margin-top: 1px;
}

/* ================= Contributors pill ================= */
.contributors {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
}

.contributors-card {
  display: flex;
	flex-direction: column;
  align-items: center;
  gap: .75rem;
  padding: .5rem .75rem .5rem .6rem;
}

.contributors-label {
  font-family: Inter, system-ui, sans-serif;
  font-weight: 800;
  font-size: .8rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: rgba(233,228,222,0.9);
	margin-bottom: 0.5em;
}

/* Avatar group (overlapping) */
.avatar-group {
  display: flex;
  align-items: center;
  padding-left: .1rem;
}
.avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 2px solid rgba(20,17,16,0.9); /* separator ring matching bg */
  overflow: hidden;
  display: inline-block;
  margin-left: -10px; /* overlap */
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  background: linear-gradient(180deg, #2b241f, #191512);
  text-decoration: none;
  transition: transform .12s ease, box-shadow .12s ease;
}
.avatar:first-child { margin-left: 0; }
.avatar:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.45); }
.avatar img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

/* Initials fallback */
.avatar--initials::after {
  content: attr(data-initials);
  position: absolute; inset: 0;
  display: grid; place-items: center;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 800;
  font-size: .8rem;
  letter-spacing: .04em;
  color: var(--text);
  opacity: .9;
}

/* "+X" more badge */
.avatar--more {
  display: grid; place-items: center;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 800; font-size: .8rem;
  color: var(--accent-ink);
  background: var(--accent);
  border-color: color-mix(in oklab, var(--accent) 65%, black);
  box-shadow: 0 6px 16px rgba(224,178,110,0.22);
  text-decoration: none;
}

/* focus ring for accessibility */
.avatar:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  z-index: 1;
}

/* responsive niceties */
@media (max-width: 720px) {
  .open-source { padding: 4.5rem 1rem; }
  .license, .text { flex: 1 1 100%; }
  .contributors-card { padding-right: .6rem; }
  .avatar { width: 32px; height: 32px; margin-left: -8px; }
}
`

