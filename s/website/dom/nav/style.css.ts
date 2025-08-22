
import {css} from "@benev/slate"

export default css`
/* Inherit the hero tokens if present, otherwise define sane defaults here */
nav {
  --bg: #141110;                         /* espresso */
  --surface: #1B1816;
  --text: #E9E4DE;                        /* warm off-white */
  --text-dim: rgba(233,228,222,0.72);
  --border: rgba(233,228,222,0.14);
  --hover: rgba(233,228,222,0.06);
  --accent: #E0B26E;                      /* gold */
  --ring: rgba(224,178,110,0.35);

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
  z-index: 1000;

  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
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

/* mobile menu sheet (warm translucent) */
.mobile-menu {
  display: none;
  flex-direction: column;
  position: absolute;
  top: calc(100% + .6em);
  right: 1.1em;

  background: color-mix(in oklab, var(--surface) 82%, black);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  padding: .8em;
  border-radius: 12px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.45);
  z-index: 999;
}
.mobile-menu a {
  color: var(--text);
  text-decoration: none;
  margin: .35em 0;
  padding: .55em .7em;
  border-radius: 8px;
  transition: background-color .12s ease, color .12s ease;
  display: inline-flex;
  align-items: center;
  gap: .6em;
}
.mobile-menu a:hover {
  background: var(--hover);
}
.mobile-menu .try {
  margin-top: .25em;
  width: 100%;
  justify-content: center;
}

/* responsiveness */
@media (max-width: 768px) {
  .center.desktop-only { display: none; }
  .right .try { display: none; }
  .menu-icon { display: block; }
  .mobile-only { display: block; }
  .mobile-menu[data-opened="true"] { display: flex; }
}
`
