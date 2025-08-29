
import {css} from "@benev/slate"

export default css`
:host {
  --bg: #141110;                         /* espresso */
  --surface: #1B1816;
  --text: #E9E4DE;                        /* warm off-white */
  --text-dim: rgba(233,228,222,0.72);
  --border: rgba(233,228,222,0.14);
  --hover: rgba(233,228,222,0.06);
  --accent: #E0B26E;                      /* gold */
  --ring: rgba(224,178,110,0.35);
  --accent: #E0B26E;
 	--card: rgba(233,228,222,0.06);
  --card-hover: rgba(233,228,222,0.10);
  --accent-ink: #1a1613;
	--shadow: rgba(0,0,0,0.55);
	--text-muted: #CFC9C2;
}

nav {
  position: fixed;
  top: 1.25em;
  left: 50%;
  transform: translateX(-50%);
  width: min(1200px, 92%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7em 1.1em;
  border-radius: 14px;
  color: var(--text);
  background: color-mix(in oklab, var(--bg) 78%, black);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  box-shadow:
    0 10px 28px rgba(0,0,0,0.35),
    0 0 0 1px rgba(0,0,0,0.25) inset;
  z-index: 100;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
}

sl-drawer::part(base) {
  z-index: 101;
}

sl-drawer::part(overlay) {
  background: rgba(10, 8, 7, 0.55);
  backdrop-filter: blur(8px);
}

sl-drawer::part(panel) {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%),
    color-mix(in oklab, var(--surface) 88%, black);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow:
    0 20px 50px rgba(0,0,0,.55),
    0 0 0 1px rgba(0,0,0,.25) inset;
}

sl-drawer::part(header) {
  border-bottom: 1px solid var(--border);
  padding: 1em;
}
sl-drawer::part(title) {
  font: 800 1rem/1 Inter, system-ui, sans-serif;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

sl-drawer::part(close-button) {
  color: var(--text);
  border-radius: 10px;
}

sl-drawer::part(close-button):hover {
  background: var(--card);
}

sl-drawer::part(body) {
  padding: 1rem 1rem 0.75rem 1rem;
}

sl-drawer::part(footer) {
  position: sticky;
  bottom: 0;
  background: color-mix(in oklab, var(--surface) 92%, black);
  border-top: 1px solid var(--border);
  padding: 1rem;
  z-index: 1;
}

.drawer-primary::part(base) {
	padding: 0.4em 1em;
  font: 800 .95rem/1 Inter, system-ui, sans-serif;
  letter-spacing: .02em;
  border-radius: 10px;
  background: var(--accent);
  color: var(--accent-ink);
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
  box-shadow: 0 8px 20px rgba(224,178,110,0.20);
}
.drawer-primary:active::part(base) {
  transform: translateY(1px);
  box-shadow: 0 4px 12px rgba(224,178,110,0.18);
}
.drawer-primary:focus-visible::part(base) {
  outline: none;
  box-shadow:
    0 8px 20px rgba(224,178,110,0.20),
    0 0 0 3px var(--sl-focus-ring-color-primary);
}

.drawer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.drawer-links a {
  display: flex;
  align-items: center;
  gap: .7rem;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  font: 600 1rem/1.3 Inter, system-ui, sans-serif;
  color: var(--text);
  text-decoration: none;
  background: color-mix(in oklab, var(--surface) 92%, black);
  border: 1px solid var(--border);
  transition: background-color .15s ease, color .15s ease, border-color .15s ease, transform .08s ease;
}

.drawer-links a::after {
  content: "›";
  margin-left: auto;
  font-weight: 900;
  opacity: .6;
  transform: translateX(0);
  transition: transform .12s ease, opacity .12s ease;
}

.drawer-links a:hover,
.drawer-links a:active {
  background: var(--card-hover);
  color: var(--accent);
  border-color: color-mix(in oklab, var(--accent) 65%, black);
}
.drawer-links a:hover::after,
.drawer-links a:active::after {
  transform: translateX(2px);
  opacity: .85;
}
.drawer-links a:active { transform: translateY(1px); }

.drawer-links a[data-current="true"] {
  background: var(--card-hover);
  border-color: var(--border);
  box-shadow: 0 0 0 1px rgba(0,0,0,.25) inset;
}

.drawer-links a + a {
  box-shadow: 0 -1px 0 rgba(233,228,222,0.06) inset;
}


/* left / logo */
.left { width: 10em; }
.logo { height: 32px; width: 36px; display: block; }

/* center links */
.center.desktop-only {
  display: flex;
  gap: 2.25em;
}

.center.desktop-only a {
  position: relative;
  text-decoration: none;
  color: var(--text-dim);
  transition: color .15s ease;
  padding: .35em .1em;
}

/* warm underline indicator on hover/active */
.center.desktop-only a::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -0.45em;
  margin-inline: auto;
  width: 0%;
  height: 2px;
  background: var(--accent);
  border-radius: 999px;
  transition: width .18s ease;
}
.center.desktop-only a:hover,
.center.desktop-only a[aria-current="page"],
.center.desktop-only a[data-active="true"] {
  color: var(--text);
}
.center.desktop-only a:hover::after,
.center.desktop-only a[aria-current="page"]::after,
.center.desktop-only a[data-active="true"]::after {
  width: 100%;
}

/* right cta */
.try {
  background: var(--accent);
  color: #1a1613;
  padding: 0.6em 1.1em;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: .65em;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid color-mix(in oklab, var(--accent) 65%, black);
  box-shadow: 0 8px 20px rgba(224,178,110,0.20);
  transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease, border-color .12s ease;
}
.try:hover {
  background: #d7a761;
  border-color: color-mix(in oklab, #d7a761 65%, black);
  box-shadow: 0 10px 24px rgba(224,178,110,0.26);
  transform: translateY(-1px);
}
.try svg {
  height: 1em; width: 1em;
  transform: translateX(0);
  transition: transform .14s ease;
}
.try:hover svg { transform: translateX(2px); }

/* mobile trigger */
.menu-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: none;
}

/* responsiveness */
@media (max-width: 768px) {
  .center.desktop-only { display: none; }
  .right .try { display: none; }
  .menu-icon { display: block; }
  .mobile-only { display: block; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .drawer-links a,
  .drawer-links a::after {
    transition: none;
  }
}

/* Small screens */
@media (max-width: 420px) {
  sl-drawer::part(title) { font-size: .9rem; }
  .drawer-links a { padding: .85rem .95rem; }
}

`
