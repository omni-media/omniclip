import {css} from "lit"

export default css`
/* Base styles and animations */
* {
	margin: 0;
	box-sizing: border-box;
}

@keyframes g-3 { 
	50% { 
		--g3-1-x-position: 42.69531250000001%; 
		--g3-1-y-position: 91.5625%; 
		--g3-2-x-position: 91.7578125%; 
		--g3-2-y-position: 33.046875%; 
		--g3-3-x-position: 5.742187500000001%; 
		--g3-3-y-position: 5.546875000000001%; 
	} 
}

@keyframes float {
	0% { transform: translateY(0px); }
	50% { transform: translateY(-10px); }
	100% { transform: translateY(0px); }
}

@keyframes pulse {
	0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
	70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
	100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes fadeIn {
	from { 
		opacity: 0;
		transform: translateY(-10px);
	}
	to { 
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes cursor1 {
	0%, 100% { transform: translate(0, 0); }
	25% { transform: translate(50px, 30px); }
	50% { transform: translate(100px, -20px); }
	75% { transform: translate(30px, 50px); }
}

@keyframes cursor2 {
	0%, 100% { transform: translate(0, 0); }
	20% { transform: translate(-40px, 20px); }
	40% { transform: translate(-80px, -30px); }
	60% { transform: translate(-20px, -60px); }
	80% { transform: translate(-60px, 10px); }
}

@keyframes cursor3 {
	0%, 100% { transform: translate(0, 0); }
	30% { transform: translate(60px, -40px); }
	60% { transform: translate(20px, 30px); }
}

@keyframes heartbeat {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.15); }
}

/* Common variables */
:host {
	--primary-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
	--secondary-gradient: linear-gradient(135deg, #f59e0b, #f97316);
	--text-primary: #f0f0f0;
	--text-secondary: rgba(255, 255, 255, 0.8);
	--bg-primary: #0a0a0a;
	--bg-card: rgba(30, 30, 30, 0.5);
	--border-light: rgba(255, 255, 255, 0.05);
	--border-medium: rgba(255, 255, 255, 0.1);
	--border-hover: rgba(255, 255, 255, 0.2);
	--shadow-small: 0 10px 20px rgba(0, 0, 0, 0.2);
	--shadow-medium: 0 15px 30px rgba(0, 0, 0, 0.2);
	--shadow-large: 0 20px 40px rgba(0, 0, 0, 0.3);
	--radius-small: 8px;
	--radius-medium: 12px;
	--radius-large: 16px;
	--radius-full: 100px;
	--transition-standard: all 0.3s ease;
}

/* Common utility classes */
.flex {
	display: flex;
	gap: 2em;
	flex-wrap: wrap;
}

/* Main layout */
.landing-page {
	display: flex;
	flex-direction: column;
	font-size: 16px;
	color: var(--text-primary);
	background: var(--bg-primary);
	overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, p, a {
	font-family: Poppins-Regular;
}

h1 {
	color: white;
	text-transform: uppercase;
	max-width: 950px;
	text-align: center;
	line-height: 1.3;
	font-size: 2.5em;
	margin-bottom: 0.5em;
	position: relative;
	z-index: 2;
}

h1 span, h2 span {
	background-clip: text !important;
	font-family: Nippo-Regular;
	background: linear-gradient(180.2deg, #FFFFFF 29.5%, #848588 50.27%, #FFFFFF 72.49%);
	display: inline-block;
	line-height: 1.3;
}

h2 {
	font-family: Nippo-Regular;
	font-size: 2.5em;
	text-align: center;
	color: white;
	text-transform: uppercase;
	position: relative;
	margin-bottom: 1.5em;
}

h2:after {
	content: '';
	position: absolute;
	bottom: -15px;
	left: 50%;
	transform: translateX(-50%);
	width: 60px;
	height: 3px;
	background: var(--primary-gradient);
	border-radius: 3px;
}

h2 span {
	font-weight: lighter;
	background-clip: text !important;
	-webkit-text-fill-color: transparent;
}

/* Navigation */
nav {
	position: fixed;
	width: 90%;
	max-width: 1200px;
	align-self: center;
	border-radius: var(--radius-large);
	margin: 1em auto;
	z-index: 10;
	display: flex;
	backdrop-filter: blur(12px);
	background: rgba(15, 15, 15, 0.8);
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	border: 1px solid var(--border-medium);
	transition: var(--transition-standard);
}

nav:hover {
	border: 1px solid var(--border-hover);
}

nav .logo {
	padding: 1em 2em;
	width: 200px;
	transition: transform 0.3s ease;
}

nav .logo:hover {
	transform: scale(1.05);
}

nav .menu {
	display: none;
}

nav .menu[data-opened] {
	display: flex;
	flex-direction: column;
	position: absolute;
	right: 20px;
	top: 70px;
	gap: 1em;
	border-radius: var(--radius-large);
	background: rgba(15, 15, 15, 0.95);
	backdrop-filter: blur(12px);
	padding: 1.5em;
	font-family: Poppins-Regular;
	box-shadow: var(--shadow-medium);
	border: 1px solid var(--border-medium);
	animation: fadeIn 0.3s ease;
}

nav a {
	text-decoration: none;
	color: white;
	cursor: pointer;
	transition: var(--transition-standard);
	position: relative;
	font-size: 1rem;
}

nav a:not(.try):after {
	content: '';
	position: absolute;
	width: 0;
	height: 2px;
	bottom: -4px;
	left: 0;
	background: var(--primary-gradient);
	transition: width 0.3s ease;
}

nav a:hover:after {
	width: 100%;
}

nav .menu-icon {
	position: relative;
	right: 20px;
	padding: 0;
	width: 26px;
	display: none;
	cursor: pointer;
	transition: transform 0.3s ease;
}

nav .menu-icon:hover {
	transform: scale(1.1);
}

nav .nav {
	display: flex;
	align-items: center;
	padding: 1em 2em;
	gap: 3em;
}

/* Button styles */
.try {
	display: flex;
	align-items: center;
	justify-content: center;
	justify-self: start;
	gap: 0.5em;
	background: var(--primary-gradient);
	color: white;
	padding: 0.8em 2em;
	border-radius: var(--radius-small);
	font-weight: bold;
	font-size: 1rem;
	transition: var(--transition-standard);
	box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
	text-decoration: none;
	border: none;
}

.try:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
}

.discord {
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	border-radius: var(--radius-small);
	color: white;
	border: 2px solid rgba(255, 255, 255, 0.2);
	font-size: 1rem;
	gap: 8px;
	transition: var(--transition-standard);
	background: rgba(88, 101, 242, 0.1);
	text-decoration: none;
	padding: 0.8em 2em;
}

.discord:hover {
	border-color: rgba(88, 101, 242, 0.6);
	background: rgba(88, 101, 242, 0.2);
	transform: translateY(-2px);
}

.discord svg {
	color: #5865F2;
	height: 24px;
}

/* Welcome section */
.welcome {
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: black 0px -5vw 15vw 5vw inset, black 0 -5vw 5vw 0 inset;
	gap: 2.5em;
	background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), rgba(255, 255, 255, 0.2) -80%, transparent), 
							radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), 
							radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #5e43e0 -52%, transparent), 
							var(--bg-primary);
	animation-name: g-3;
	animation-iteration-count: infinite;
	animation-duration: 15s;
	transition-timing-function: ease-in-out;
	padding: 15em 3em 10em;
	position: relative;
	overflow: hidden;
}

.welcome:after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 150px;
	background: linear-gradient(to top, var(--bg-primary), transparent);
	z-index: 1;
}

.welcome h2 {
	max-width: 650px;
	text-align: center;
	line-height: 1.6;
	font-size: 1em;
	font-weight: lighter;
	color: white;
	font-family: Poppins-ExtraLight;
	-webkit-text-fill-color: unset;
	margin-bottom: 1em;
	position: relative;
	z-index: 2;
}

.welcome h2 span {
	-webkit-text-fill-color: unset;
}

.welcome p {
	color: white;
	padding: 0.5em 1.5em;
	border-radius: var(--radius-full);
	font-size: 1em;
	border: 1px solid rgba(255, 255, 255, 0.3);
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(5px);
	letter-spacing: 1px;
	text-transform: uppercase;
	margin-bottom: 1em;
	position: relative;
	z-index: 2;
}

.welcome .btns {
	display: flex;
	gap: 15px;
	position: relative;
	z-index: 2;
	flex-wrap: wrap;
	justify-content: center;
}

.welcome button, .welcome a {
	width: 220px;
	height: 50px;
}

/* Section styles */
.abilities, .collaboration, .transitions, .differences, .developers, .coming-soon {
	position: relative;
	background: var(--bg-primary);
	padding: 5em 3em;
}

.abilities:before, .collaboration:before, .transitions:before, .differences:before, .developers:before, .coming-soon:before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

/* Capabilities section */
.abilities {
	display: flex;
	justify-content: center;
	gap: 3em;
	flex-wrap: wrap;
	flex-direction: column;
	align-items: center;
}

.abilities .items {
	display: flex;
	flex-direction: column;
	gap: 2em;
	border-radius: 20px;
	flex-wrap: wrap;
	justify-content: center;
	text-align: center;
	max-width: 1200px;
	margin: 0 auto;
}

.abilities .items .flex {
	justify-content: center;
}

.abilities .items h4 {
	font-family: Poppins-ExtraLight;
	font-size: 1.1em;
	margin-bottom: 2em;
	color: var(--text-primary);
	max-width: 800px;
	margin-left: auto;
	margin-right: auto;
}

.abilities .item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 120px;
	height: 100px;
	gap: 0.8em;
	padding: 1.5em;
	border-radius: var(--radius-large);
	background: var(--bg-card);
	border: 1px solid var(--border-light);
	transition: var(--transition-standard);
}

.abilities .item:hover {
	transform: translateY(-5px);
	background: rgba(40, 40, 40, 0.7);
	border-color: var(--border-medium);
	box-shadow: var(--shadow-small);
}

.abilities .item img {
	width: 40px;
	height: 40px;
	transition: transform 0.3s ease;
}

.abilities .item:hover img {
	transform: scale(1.1);
}

.abilities .item p {
	color: rgba(255, 255, 255, 0.9);
	text-align: center;
	font-size: 0.95em;
	line-height: 1.4;
}

.abilities .more {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 3em;
	margin-top: 3em;
}

.abilities .more .flex {
	display: flex;
	flex-direction: column;
	gap: 3em;
}

.abilities .item-more {
	background: var(--bg-card);
	border-radius: var(--radius-large);
	padding: 2em;
	transition: var(--transition-standard);
	border: 1px solid var(--border-light);
}

.abilities .item-more:hover {
	transform: translateY(-5px);
	box-shadow: var(--shadow-medium);
	border-color: var(--border-medium);
}

.abilities .item-more h3 {
	margin-bottom: 0.5em;
	font-size: 1.5em;
	background: var(--primary-gradient);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.abilities .item-more p {
	font-family: Poppins-ExtraLight;
	font-size: 0.9em;
	margin-bottom: 1.5em;
	line-height: 1.6;
}

.abilities .item-more video, .abilities .item-more img {
	width: 300px;
	border-radius: var(--radius-medium);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-medium);
}

.abilities .export {
	display: flex;
	margin: 5em 0;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	gap: 5em;
	padding: 3em;
	border-radius: 20px;
	color: white;
	background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), rgba(255, 255, 255, 0.2) -80%, transparent), 
							radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), 
							radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #5e43e0 -52%, transparent), 
							var(--bg-primary);
	box-shadow: var(--shadow-large);
	border: 1px solid var(--border-light);
	position: relative;
	overflow: hidden;
}

.abilities .export:before {
	content: '';
	position: absolute;
	top: -50%;
	left: -50%;
	width: 200%;
	height: 200%;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
	opacity: 0.5;
	animation: rotate 20s linear infinite;
}

.abilities .export video {
	max-width: 350px;
	width: 100%;
	border-radius: var(--radius-large);
	box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
	border: 1px solid var(--border-medium);
	position: relative;
	z-index: 1;
}

.abilities .emoji {
	font-family: "Noto Color Emoji";
	margin-left: 0.5em;
}

.abilities .export h3 {
	text-align: left;
	font-size: 2em;
	margin-bottom: 0.5em;
	background: linear-gradient(90deg, #fff, #a5b4fc);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	position: relative;
	z-index: 1;
}

.abilities .export ul {
	display: flex;
	flex-direction: column;
	gap: 1.5em;
	align-items: self-start;
	font-family: Poppins-Regular;
	margin-top: 2em;
	text-align: left;
	position: relative;
	z-index: 1;
}

.abilities .export ul li {
	display: flex;
	align-items: center;
	font-size: 1.1em;
}

.abilities .export ul li:before {
	content: '';
	display: inline-block;
	width: 8px;
	height: 8px;
	background: var(--primary-gradient);
	border-radius: 50%;
	margin-right: 12px;
}

.abilities .export ul li:last-child {
	font-weight: bold;
	margin-top: 1em;
}

.abilities .export ul .try {
	padding: 0.5em 1.2em;
	font-size: 14px;
	margin-left: 1em;
}

/* Collaboration section */
.collaboration {
	padding: 8em 3em;
	overflow: hidden;
}

.collaboration:after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: 
		radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
		radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
	z-index: 0;
}

.collab-container {
	display: flex;
	max-width: 1200px;
	margin: 0 auto;
	position: relative;
	z-index: 1;
	gap: 4em;
	flex-wrap: wrap;
}

.collab-content {
	flex: 1;
	min-width: 300px;

	& .flex {
		display: flex;
	}
}

.collab-content h2 {
	text-align: left;
	margin-bottom: 0.8em;
}

.collab-content h2:after {
	left: 0;
	transform: none;
}

.collab-content > p {
	font-family: Poppins-Regular;
	font-size: 1.1em;
	line-height: 1.6;
	color: var(--text-secondary);
	margin-bottom: 2.5em;
	max-width: 500px;
	text-align: left;
}

.collab-features {
	display: flex;
	flex-direction: column;
	gap: 1.5em;
	margin-bottom: 3em;
	padding: 0;
}

.collab-features li {
	display: flex;
	align-items: flex-start;
	gap: 1.5em;
	background: var(--bg-card);
	border-radius: var(--radius-large);
	padding: 1.5em;
	border: 1px solid var(--border-light);
	transition: var(--transition-standard);
}

.collab-features li:hover {
	transform: translateY(-5px);
	background: rgba(40, 40, 40, 0.7);
	border-color: var(--border-medium);
	box-shadow: var(--shadow-small);
}

.feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 50px;
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
	border-radius: var(--radius-medium);
}

.feature-icon svg {
	width: 28px;
	height: 28px;
	fill: #6366f1;
	color: #6366f1;
}

.feature-text {
	flex: 1;
}

.feature-text h3 {
	font-size: 1.2em;
	margin-bottom: 0.5em;
	background: var(--primary-gradient);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.feature-text p {
	font-family: Poppins-ExtraLight;
	font-size: 0.95em;
	line-height: 1.5;
	color: var(--text-secondary);
}

.collab-demo {
	background: #111;
	padding: 16px;
	border-radius: 10px;
	max-width: 500px;
	width: 100%;
	margin: auto;
	box-shadow: 0 0 10px #0004;
}

.media-preview {
	background: #222;
	padding: 16px;
	border-radius: 6px;
	margin-bottom: 20px;
	z-index: 0;
	position: relative;
}

.media-frame {
	background: #333;
	color: #fff;
	height: 160px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 4px;
	margin-bottom: 10px;
	font-size: 1rem;
}

.media-controls {
	display: flex;
	gap: 8px;
	justify-content: center;
}

.media-controls button {
	background: #444;
	color: white;
	border: none;
	padding: 6px 12px;
	border-radius: 4px;
	cursor: pointer;
}

.timeline {
	position: relative;
	background: #1a1a1a;
	height: 80px;
	border-radius: 6px;
	overflow: visible;
	margin-top: 10px;
	z-index: 1;
}

.track {
	position: relative;
	height: 100%;
}

.clip {
	position: absolute;
	height: 60%;
	top: 20%;
	border-radius: 4px;
}

.video-clip {
	background: #5e5ce6;
}

.audio-clip {
	background: #00c2cb;
}

.collab-cursors {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	pointer-events: none;
	z-index: 2; /* Ensures cursors are above the clips */
}

.cursor-1 {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 3px;
	background-color: #00ffcc;
	animation: moveCursor 4s ease-in-out infinite alternate;
}

.cursor-1::after {
	content: attr(data-user);
	position: absolute;
	top: -24px;
	left: -10px;
	font-size: 0.7rem;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 2px 6px;
	border-radius: 4px;
	white-space: nowrap;
}

.cursor-1 { background-color: #00ffcc; animation-delay: 0s; }
/* .cursor-2 { background-color: #ff3366; animation-delay: 1s; } */

@keyframes moveCursor {
	from { left: var(--start); }
	to { left: var(--end); }
}

.collab-visual {
	flex: 1;
}

.collab-demo .cursor-2 {
	position: absolute;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	z-index: 2;
}

.collab-demo .cursor-2:after {
	content: attr(data-user);
	position: absolute;
	white-space: nowrap;
	background: #000;
	color: white;
	padding: 0.3em 0.6em;
	border-radius: 4px;
	font-size: 0.8em;
	top: -25px;
	left: 50%;
	transform: translateX(-50%);
}

.collab-demo .cursor-2 {
	background: #6366f1;
	top: 30%;
	left: 25%;
	animation: cursor1 8s infinite ease-in-out;
}

.collab-demo .cursor-2 {
	background: #8b5cf6;
	top: -100%;
	left: 60%;
	animation: cursor2 12s infinite ease-in-out;
}

.collab-demo .cursor-3 {
	background: #ec4899;
	top: 70%;
	left: 40%;
	animation: cursor3 10s infinite ease-in-out;
}

/* Transitions section */
.transitions {
	padding: 8em 3em;
}

.transitions-header {
	text-align: center;
	max-width: 800px;
	margin: 0 auto 4em;
}

.transitions-header p {
	font-family: Poppins-Regular;
	font-size: 1.1em;
	line-height: 1.6;
	color: var(--text-secondary);
}

.transitions-header .gl-link {
	color: #a5b4fc;
	text-decoration: none;
	position: relative;
	transition: var(--transition-standard);
}

.transitions-header .gl-link:after {
	content: '';
	position: absolute;
	width: 100%;
	height: 1px;
	bottom: -2px;
	left: 0;
	background: #a5b4fc;
	transform: scaleX(0);
	transform-origin: bottom right;
	transition: transform 0.3s ease;
}

.transitions-header .gl-link:hover {
	color: #c7d2fe;
}

.transitions-header .gl-link:hover:after {
	transform: scaleX(1);
	transform-origin: bottom left;
}

.transitions-container {
	display: flex;
	max-width: 1200px;
	margin: 0 auto;
	gap: 4em;
	flex-wrap: wrap;
}

.transitions-info {
	flex: 1;
	min-width: 300px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.transition-features {
	display: flex;
	flex-direction: column;
	gap: 1.5em;
	margin-bottom: 3em;
}

.transition-features .feature {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.5em;
	background: var(--bg-card);
	border-radius: var(--radius-large);
	padding: 1.5em;
	border: 1px solid var(--border-light);
	transition: var(--transition-standard);

	& .flex {
		display: flex;
		align-items: center;
		gap: 1em;
	}
}

.transition-features .feature:hover {
	transform: translateY(-5px);
	background: rgba(40, 40, 40, 0.7);
	border-color: var(--border-medium);
	box-shadow: var(--shadow-small);
}

.transition-features .feature-content {
	flex: 1;
	padding: 0;
}

.transitions-cta {
	display: flex;
	flex-direction: column;
	gap: 1em;
}

.transitions-cta .transitions-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5em;
	color: white;
	text-decoration: none;
	font-size: 0.95rem;
	transition: var(--transition-standard);
}

.transitions-cta .transitions-link svg {
	width: 16px;
	height: 16px;
	transition: transform 0.3s ease;
}

.transitions-cta .transitions-link:hover {
	color: #a5b4fc;
}

.transitions-cta .transitions-link:hover svg {
	transform: translateX(3px);
}

.transitions-demo {
	flex: 1;
	min-width: 300px;
}

.video-container {
	position: relative;
	border-radius: var(--radius-large);
	overflow: hidden;
	box-shadow: var(--shadow-large);
	border: 1px solid var(--border-medium);
}

.video-container video {
	width: 100%;
	display: block;
	border-radius: var(--radius-large);
}

.video-container .transition-counter {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	padding: 1em;
	background: rgba(0, 0, 0, 0.7);
	backdrop-filter: blur(10px);
	color: white;
	font-size: 0.9em;
}

.video-container .current-transition strong {
	color: #a5b4fc;
}

.transitions-gallery {
	display: flex;
	gap: 0.5em;
	margin-top: 1em;
	flex-wrap: wrap;
}

.transitions-gallery .transition-thumbnail {
	width: 60px;
	height: 40px;
	border-radius: 8px;
	background: rgba(30, 30, 30, 0.8);
	border: 1px solid var(--border-medium);
	cursor: pointer;
	transition: var(--transition-standard);
}

.transitions-gallery .transition-thumbnail img {
	width: 100%;
	height: 100%;
	border-radius: 8px;
}

.transitions-gallery .transition-thumbnail:hover {
	transform: translateY(-3px);
	border-color: var(--border-hover);
}

.transitions-gallery .transition-thumbnail.active {
	border: 2px solid #6366f1;
	box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

/* Transitions dropdown styles */
.more-transitions {
	position: relative;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8em;
	color: white;
	z-index: 9;
	transition: var(--transition-standard);
}

.more-transitions:hover {
	background: rgba(40, 40, 40, 0.8);
	color: #a5b4fc;
}

.transitions-dropdown {
	position: absolute;
	top: calc(100% + 10px);
	right: 0;
	width: 400px;
	background: rgba(20, 20, 20, 0.95);
	border-radius: var(--radius-medium);
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
	padding: 1em;
	z-index: 100;
	opacity: 0;
	visibility: hidden;
	transform: translateY(-10px);
	transition: all 0.3s ease;
	backdrop-filter: blur(10px);
}

.transitions-dropdown[data-open] {
	opacity: 1;
	visibility: visible;
	transform: translateY(0);
}

.dropdown-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 0.5em;
	max-height: 300px;
	overflow-y: auto;
}

.dropdown-grid .transition-thumbnail {
	width: 100%;
	height: 40px;
	margin: 0;
}

.dropdown-grid .transition-thumbnail:hover {
	transform: translateY(-3px);
	border-color: rgba(255, 255, 255, 0.3);
}

/* Features section */
.differences {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.differences .items {
	display: flex;
	flex-direction: column;
	gap: 3em;
	max-width: 1200px;
	width: 100%;
}

.differences .gh {
	position: absolute;
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
	z-index: 1;
}

.differences .gh .flex {
	display: flex;
	flex-direction: column;
	gap: 0.5em;
	align-items: center;
	backdrop-filter: blur(5px);
	transition: all 0.5s ease;
	padding: 1.5em;
	border-radius: var(--radius-large);
	border: 1px solid var(--border-hover);
	background: rgba(0, 0, 0, 0.7);
	margin-top: 200px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.differences .gh .flex:hover {
	transform: scale(1.05);
	border-color: rgba(255, 255, 255, 0.3);
}

.differences .gh a {
	color: white;
	text-decoration: none;
	font-weight: bold;
	font-size: 1.2em;
}

.differences .gh .stars {
	width: 120px;
	height: 30px;
}

.differences .free {
	position: relative;
	overflow: hidden;
}

.differences .free .emoji-1 {
	position: absolute;
	font-size: 150px;
	top: 45%;
	left: 10%;
	opacity: 0.5;
	animation: float 6s ease-in-out infinite;
	z-index: 0;
}

.differences .free .emoji-2 {
	position: absolute;
	font-size: 150px;
	bottom: 0;
	right: 10%;
	opacity: 0.5;
	animation: float 6s ease-in-out infinite 1s;
	z-index: 0;
}

.differences .free .view {
	width: 100%;
	height: 100%;
	min-height: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	backdrop-filter: blur(100px);
	position: relative;
}

.differences .free .try {
	background: var(--secondary-gradient);
	font-size: 1.5em;
	box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
}

.differences .free .try:hover {
	transform: scale(1.05) translateY(-5px);
	box-shadow: 0 15px 30px rgba(249, 115, 22, 0.4);
}

.differences .free .try:active {
	transform: scale(0.98);
}

.differences .free, .differences .open {
	min-width: 300px;
	flex: 1;
}

.differences .free h3, .differences .open h3 {
	padding: 1em;
	font-size: 1.8em;
	text-align: center;
	background: linear-gradient(90deg, #fff, #a5b4fc);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.differences .free p, .differences .open p {
	padding: 0 2em 2em;
	text-align: center;
	font-size: 1.1em;
	line-height: 1.6;
	color: var(--text-secondary);
}

.differences .more {
	min-width: 250px;
	flex: 1;
	gap: 1em;
	padding: 2em;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: var(--bg-card);
	border-radius: var(--radius-large);
	border: 1px solid var(--border-light);
	transition: var(--transition-standard);
}

.differences .more:hover {
	transform: translateY(-5px);
	background: rgba(40, 40, 40, 0.7);
	border-color: var(--border-medium);
	box-shadow: var(--shadow-medium);
}

.differences .more svg {
	width: 80px;
	height: 80px;
	color: #6366f1;
	opacity: 0.9;
	transition: var(--transition-standard);
}

.differences .more:hover svg {
	transform: scale(1.1);
	color: #8b5cf6;
}

.differences .more h3 {
	font-size: 1.5em;
	margin-bottom: 0.5em;
	background: var(--primary-gradient);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.differences .more p {
	font-size: 1em;
	line-height: 1.6;
	text-align: center;
	color: var(--text-secondary);
	padding: 0;
}

.differences .item {
	position: relative;
	display: flex;
	flex-direction: column;
	border-radius: var(--radius-large);
	align-items: center;
	background: var(--bg-card);
	border: 1px solid var(--border-light);
	overflow: hidden;
	transition: var(--transition-standard);
	flex: 1;
}

.differences .item:hover {
	transform: translateY(-5px);
	border-color: var(--border-medium);
	box-shadow: var(--shadow-medium);
}

.differences .item img {
	flex: 1;
	max-height: 400px;
	width: 100%;
	object-fit: cover;
	transition: all 0.5s ease;
}

.differences .item:hover img {
	transform: scale(1.05);
}

.differences .item p {
	font-size: 1em;
	font-family: Poppins-ExtraLight;
	text-align: center;
	line-height: 1.6;
	color: var(--text-secondary);
}

/* Coming Soon section */
.coming-soon {
	padding: 8em 3em;
}

.coming-soon-header {
	text-align: center;
	max-width: 800px;
	margin: 0 auto 4em;

	& h2:after {
		display: none;
	}
}

.coming-soon-header .feature-badge {
	font-size: 0.4em;
	background: var(--secondary-gradient);
	color: white;
	padding: 0.4em 0.8em;
	border-radius: 20px;
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.5px;
	animation: pulse 2s infinite;
	vertical-align: middle;
	margin-left: 0.8em;
}

.coming-soon-header p {
	font-family: Poppins-Regular;
	font-size: 1.1em;
	line-height: 1.6;
	color: var(--text-secondary);
	margin-top: 1.5em;
}

.coming-soon-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	max-width: 1200px;
	margin: 0 auto;
	gap: 6em;
}

.coming-soon-feature {
	display: flex;
	gap: 4em;
	align-items: start;
	flex-wrap: wrap;
}

.coming-soon-feature:nth-child(odd) {
	flex-direction: row-reverse;
}

.feature-content {
	flex: 1;
	min-width: 300px;
}

.feature-content .flex {
	display: flex;
	align-items: center;
	gap: 1.5em;
}

.feature-icon-large {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60px;
	height: 60px;
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
	border-radius: var(--radius-medium);
	margin-bottom: 1.5em;
	border: 1px solid rgba(99, 102, 241, 0.2);
}

.feature-icon-large svg {
	width: 40px;
	height: 40px;
	color: #6366f1;
}

.feature-content h3 {
	font-size: 2em;
	margin-bottom: 0.8em;
	background: var(--primary-gradient);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.feature-content p {
	font-family: Poppins-Regular;
	font-size: 1.1em;
	line-height: 1.6;
	color: var(--text-secondary);
	margin-bottom: 1.5em;
	max-width: 500px;
	min-height: 120px;
}

.feature .small {
	margin-bottom: 0;
	min-height: auto;
}

.feature-list {
	display: flex;
	flex-direction: column;
	gap: 0.8em;
	margin-bottom: 2em;
}

.feature-list li {
	display: flex;
	align-items: center;
	font-family: Poppins-Regular;
	color: white;
}

.coming-soon-feature .feature-list li:before {
	color: #6366f1;
	scale: 2;
}

.feature-list li:before {
	content: '• ';
	scale: 1.5;
	display: inline-block;
	border-radius: 50%;
	margin-right: 12px;
}

.coming-soon-cta {
	display: flex;
	gap: 1.5em;
	margin-top: 4em;
	flex-wrap: wrap;
	justify-content: center;
}

.coming-soon-cta a {
	display: flex;
	align-items: center;
	gap: 0.8em;
	padding: 0.8em 1.5em;
	background: rgba(20, 20, 20, 0.6);
	border: 1px solid var(--border-medium);
	border-radius: 8px;
	color: white;
	text-decoration: none;
	transition: var(--transition-standard);
}

.coming-soon-cta a svg {
	width: 20px;
	height: 20px;
	color: #6366f1;
	transition: transform 0.3s ease;
}

.coming-soon-cta a:hover {
	background: rgba(30, 30, 30, 0.8);
	border-color: var(--border-hover);
	transform: translateY(-3px);
	box-shadow: var(--shadow-small);
}

.coming-soon-cta a:hover svg {
	transform: scale(1.1);
	color: #8b5cf6;
}

.coming-soon-cta .notify-link {
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1));
	border-color: rgba(245, 158, 11, 0.3);
}

.coming-soon-cta .notify-link svg {
	color: #f59e0b;
}

.coming-soon-cta .notify-link:hover svg {
	color: #f97316;
}

.coming-soon-cta .github-link {
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
	border-color: rgba(99, 102, 241, 0.2);
}

/* Developers section */
.developers {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: var(--bg-primary);
	position: relative;
	padding: 5em 3em;
}

.developers h2 {
	display: flex;
	align-items: center;
	gap: 1em;
}

.developers h2 .coming-soon-badge {
	font-size: 0.4em;
	background: var(--secondary-gradient);
	color: white;
	padding: 0.4em 0.8em;
	border-radius: 20px;
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.5px;
	animation: pulse 2s infinite;
}

.developers .item {
	align-self: stretch;
	padding: 2.5em;
	display: flex;
	align-items: center;
	flex: 1;
	flex-direction: column;
	border-radius: var(--radius-large);
	background: var(--bg-card);
	border: 1px solid var(--border-light);
	transition: var(--transition-standard);
}

.developers .item h3 {
	font-size: 2em;
	margin-bottom: 0.8em;
	background: var(--primary-gradient);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-align: center;
}

.developers .item .p-api {
	max-width: 800px;
	font-size: 1.1em;
	margin-bottom: 2em;
	text-align: center;
	line-height: 1.6;
	color: var(--text-secondary);
}

.developers .dev-features {
	display: flex;
	gap: 2em;
	margin-bottom: 2.5em;
	flex-wrap: wrap;
	justify-content: center;
}

.developers .dev-features .feature {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.8em;
	position: relative;
}

.developers .dev-features .feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60px;
	height: 60px;
	background: rgba(20, 20, 20, 0.6);
	border-radius: var(--radius-medium);
	border: 1px solid var(--border-medium);
	transition: var(--transition-standard);
}

.developers .dev-features .feature-icon svg {
	width: 30px;
	height: 30px;
	color: #6366f1;
}

.developers .dev-features .feature:hover .feature-icon {
	transform: translateY(-5px);
	background: rgba(30, 30, 30, 0.8);
	border-color: var(--border-hover);
	box-shadow: var(--shadow-small);
}

.developers .dev-features .feature span {
	font-family: Poppins-Regular;
	color: white;
	font-size: 0.95em;
}

.developers .dev-features .feature .eta {
	font-size: 0.8em;
	color: #f59e0b;
	background: rgba(245, 158, 11, 0.1);
	padding: 0.3em 0.6em;
	border-radius: 4px;
	margin-top: 0.3em;
}

.developers .api {
	margin-top: 1em;
	width: 100%;
}

.developers .api .concepts {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: start;
	gap: 2em;
	width: 100%;
	background: rgba(20, 20, 20, 0.8);
	border-radius: var(--radius-large);
	padding: 2em;
	border: 1px solid var(--border-light);
	box-shadow: var(--shadow-medium);
}

.developers .api .concept:first-child {
	max-width: 500px;
}

.developers .api .concept:last-child {
	max-width: 350px;
}

.developers .api .concept {
	flex: 1 1 auto;
	position: relative;
	transition: var(--transition-standard);
}

.developers .api .concepts img {
	border-radius: var(--radius-medium);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-medium);
	transition: var(--transition-standard);
	width: 100%;
}

.developers .api .coming-soon-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-medium);
	opacity: 0.7;
	transition: var(--transition-standard);
}

.developers .api .overlay-content {
	background: var(--primary-gradient);
	color: white;
	padding: 0.5em 1em;
	border-radius: 8px;
	font-weight: bold;
	font-size: 0.9em;
	letter-spacing: 0.5px;
}

.developers .api .concepts span {
	display: flex;
	position: absolute;
	align-items: center;
	background: white;
	padding: 0.4em 1em;
	color: black;
	margin: 1em;
	font-family: "Nippo-Regular";
	gap: 0.5em;
	border-radius: 20px;
	font-weight: 500;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	z-index: 2;
}

.developers .api .concepts span svg {
	color: #6366f1;
}

.developers .dev-cta {
	display: flex;
	gap: 1.5em;
	margin-top: 2.5em;
	flex-wrap: wrap;
	justify-content: center;
}

.developers .dev-cta a {
	display: flex;
	align-items: center;
	gap: 0.8em;
	padding: 0.8em 1.5em;
	background: rgba(20, 20, 20, 0.6);
	border: 1px solid var(--border-medium);
	border-radius: 8px;
	color: white;
	text-decoration: none;
	transition: var(--transition-standard);
}

.developers .dev-cta a svg {
	width: 20px;
	height: 20px;
	color: #6366f1;
	transition: transform 0.3s ease;
}

.developers .dev-cta a:hover {
	background: rgba(30, 30, 30, 0.8);
	border-color: var(--border-hover);
	box-shadow: var(--shadow-small);
}

.developers .dev-cta a:hover svg {
	transform: scale(1.1);
	color: #8b5cf6;
}

.developers .dev-cta .notify-link {
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1));
	border-color: rgba(245, 158, 11, 0.3);
}

.developers .dev-cta .notify-link svg {
	color: #f59e0b;
}

.developers .dev-cta .notify-link:hover svg {
	color: #f97316;
}

.developers .dev-cta .github-link {
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
	border-color: rgba(99, 102, 241, 0.2);
}

.code-samples {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 2rem;
}

.code-sample {
	background-color: #1e1e1e;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.code-sample-header {
	display: flex;
	align-items: center;
	background-color: #333;
	padding: 0.5rem 1rem;
	color: white;
	font-size: 0.9rem;
}

.code-sample img {
	width: 100%;
	height: 350px;
	display: block;

}

.code-sample:nth-child(1) {
	max-width: 350px;
}

.code-sample:nth-child(2) {
	max-width: 500px;
}


/* Developer Section Styles */
.developers {
	background: var(--bg-primary);
	padding: 8em 3em;
	position: relative;
}

.developers:before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.developers h2 {
	display: flex;
	align-items: center;
	gap: 1em;
	flex-wrap: wrap;
	justify-content: center;

	&:after {
		display: none;
	}
}

.developers .coming-soon-badge {
	font-size: 0.4em;
	background: var(--secondary-gradient);
	color: white;
	padding: 0.4em 0.8em;
	border-radius: 20px;
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.5px;
	animation: pulse 2s infinite;
}

.section-intro {
	text-align: center;
	max-width: 800px;
	margin: 0 auto 4em;
	font-size: 1.2em;
	color: var(--text-secondary);
	line-height: 1.6;
}

/* Feature Grid Layout */
.dev-features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2em;
	max-width: 1200px;
	margin: 0 auto 3em;
}

/* Feature Cards */
.dev-feature-card {
	background: var(--bg-card);
	border-radius: var(--radius-large);
	border: 1px solid var(--border-light);
	overflow: hidden;
	transition: var(--transition-standard);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.dev-feature-card:hover {
	transform: translateY(-5px);
	border-color: var(--border-medium);
	box-shadow: var(--shadow-medium);
}

.feature-header {
	padding: 1.5em;
	border-bottom: 1px solid var(--border-light);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.feature-header h3 {
	font-size: 1.4em;
	margin: 0;
	background: var(--primary-gradient);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.feature-header .eta {
	font-size: 0.8em;
	color: #f59e0b;
	background: rgba(245, 158, 11, 0.1);
	padding: 0.3em 0.6em;
	border-radius: 4px;
}

.feature-content {
	padding: 1.5em;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.feature-list {
	margin: 0 0 1.5em;
	padding: 0;
	list-style: none;
}

.feature-list li {
	position: relative;
	padding-left: 1.5em;
	margin-bottom: 0.8em;
	line-height: 1.5;
	color: var(--text-secondary);
}

.dev-feature-card.main-feature {
	grid-column: 1 / -1;
	margin-bottom: 4em;
}

.dev-features-grid.subfeatures {
	margin-top: 0;
}
.dev-features-grid.subfeatures .feature-header h4 {
	font-size: 1.2em;
}

.developers h2 {
	font-size: 2em;
	justify-content: center;
	text-align: center;
}


/* Sub-feature Sections */
.sub-feature {
	margin-top: 2em;
	border-top: 1px solid var(--border-light);
	padding-top: 1.5em;
}

.sub-feature h4 {
	font-size: 1.2em;
	margin-bottom: 1em;
	display: flex;
	align-items: center;
	gap: 0.5em;
	color: var(--text-primary);
}

.sub-feature .eta {
	font-size: 0.75em;
	color: #f59e0b;
	background: rgba(245, 158, 11, 0.1);
	padding: 0.3em 0.6em;
	border-radius: 4px;
	white-space: nowrap;
}
.subfeature-label {
	font-weight: bold;
	font-size: 0.9em;
	margin-bottom: 0.5em;
	color: var(--text-secondary);
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.inline-eta {
	background: rgba(245, 158, 11, 0.1);
	color: #f59e0b;
	padding: 0.2em 0.5em;
	border-radius: 4px;
	font-size: 0.75em;
	font-weight: normal;
}

/* Code Preview Styles */
.code-preview {
	background: rgba(0, 0, 0, 0.3);
	border-radius: var(--radius-medium);
	padding: 1em;
	margin-top: auto;
	overflow: hidden;
	position: relative;
}

.code-preview:before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 3px;
	background: var(--primary-gradient);
}

.code-preview.cli:before {
	background: linear-gradient(90deg, #10b981, #059669);
}

.code-preview.json:before {
	background: linear-gradient(90deg, #f59e0b, #d97706);
}

.code-preview pre {
	margin: 0;
	overflow-x: auto;
}

.code-preview code {
	font-family: "Fira Code", monospace;
	font-size: 0.85em;
	color: #e2e8f0;
	line-height: 1.5;
}

/* Template Preview */
.template-preview {
	margin-top: auto;
	text-align: center;
}

.template-preview img {
	max-width: 100%;
	border-radius: var(--radius-medium);
	border: 1px solid var(--border-medium);
}

/* CTA Section */
.dev-cta {
	display: flex;
	gap: 1.5em;
	margin-top: 3em;
	flex-wrap: wrap;
	justify-content: center;
}

.dev-cta a {
	display: flex;
	align-items: center;
	gap: 0.8em;
	padding: 0.8em 1.5em;
	background: rgba(20, 20, 20, 0.6);
	border: 1px solid var(--border-medium);
	border-radius: 8px;
	color: white;
	text-decoration: none;
	transition: var(--transition-standard);
}

.dev-cta a svg {
	width: 20px;
	height: 20px;
	color: #6366f1;
	transition: transform 0.3s ease;
}

.dev-cta a:hover {
	background: rgba(30, 30, 30, 0.8);
	border-color: var(--border-hover);
	transform: translateY(-3px);
	box-shadow: var(--shadow-small);
}

.dev-cta a:hover svg {
	transform: scale(1.1);
	color: #8b5cf6;
}

.dev-cta .notify-link {
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1));
	border-color: rgba(245, 158, 11, 0.3);
}

.dev-cta .notify-link svg {
	color: #f59e0b;
}

.dev-cta .notify-link:hover svg {
	color: #f97316;
}

.dev-cta .github-link {
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
	border-color: rgba(99, 102, 241, 0.2);
}

/* Responsive Adjustments */
@media only screen and (max-width: 768px) {
	.developers {
		padding: 5em 2em;
	}

	.section-intro {
		font-size: 1.1em;
		margin-bottom: 3em;
	}

	.dev-features-grid {
		grid-template-columns: 1fr;
	}
}

@media only screen and (max-width: 480px) {
	.developers {
		padding: 4em 1.5em;
	}

	.feature-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5em;
	}

	.feature-header .eta {
		align-self: flex-start;
	}

	.dev-cta {
		flex-direction: column;
	}

	.dev-cta a {
		width: 100%;
		justify-content: center;
	}
}


/* Footer with background logo */
footer {
	display: flex;
	justify-content: space-between;
	padding: 6em;
	background: rgba(20, 20, 20, 0.95);
	font-size: 0.9em;
	font-family: Poppins-Regular;
	position: relative;
	overflow: hidden;
}

footer:before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* Large background logo */
.footer-logo-background {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.05;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

.footer-logo-background img {
	width: 150%;
	max-width: 1500px;
	height: auto;
	object-fit: cover;
	filter: blur(2px);
	transform: rotate(-12deg) scale(1.2);
	transition: transform 30s ease;
}

footer:hover .footer-logo-background img {
	transform: rotate(-8deg) scale(1.25);
}

/* Footer content */
.footer-content {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	position: relative;
	z-index: 1;
}

.footer-main {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 2em;
}

.footer-links {
	display: flex;
	gap: 2em;
}

.footer-links a {
	position: relative;
	cursor: pointer;
	transition: color 0.3s ease;
}

.footer-links a:hover {
	color: #6366f1;
}

.footer-links a:after {
	content: '';
	position: absolute;
	width: 0;
	height: 1px;
	bottom: -2px;
	left: 0;
	background: #6366f1;
	transition: width 0.3s ease;
}

.footer-links a:hover:after {
	width: 100%;
}

.creator-credit {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1em;
	color: var(--text-secondary);
}

.creator-credit .github-link {
	display: inline-flex;
	align-items: center;
	gap: 0.4em;
	color: #a5b4fc;
	text-decoration: none;
	transition: var(--transition-standard);
	padding: 0.4em 0.8em;
	background: rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	border: 1px solid rgba(99, 102, 241, 0.2);
}

.creator-credit .github-link:hover {
	color: #6366f1;
	background: rgba(99, 102, 241, 0.15);
	transform: translateY(-2px);
}

.creator-credit .github-link svg {
	width: 16px;
	height: 16px;
}

/* Responsive styles */
@media only screen and (max-width: 1200px) {
	.welcome {
		padding: 12em 3em 8em;
		background-size: cover;
	}

	.coming-soon-container {
		gap: 3em;
	}
}

@media only screen and (max-width: 1024px) {
	.landing-page nav .logo {
		padding: 1em 2em;
		width: 150px;
	}

	.landing-page nav .menu-icon {
		display: block;
	}

	.landing-page nav .nav {
		padding: 1em 2em;
		display: none;
	}

	.welcome {
		font-size: 0.9rem;
		padding: 10em 3em 6em;
	}

	.collaboration, .transitions, .coming-soon {
		padding: 6em 3em;
	}

	.transitions-container {
		flex-direction: column-reverse;
	}

	.collab-container {
		flex-direction: column;
	}

	.collab-content .flex {
		flex-direction: column-reverse;
	}

	.collab-content h2, .transitions-header h2, .coming-soon-header h2 {
		font-size: 2.2em;
	}
}

@media only screen and (max-width: 768px) {
	.welcome {
		font-size: 0.8rem;
		padding: 10em 2em 6em;
	}

	.abilities, .collaboration, .transitions, .differences, .developers, .coming-soon {
		padding: 4em 2em;
	}

	.abilities h2, .collab-content h2, .transitions-header h2, .developers h2, .coming-soon-header h2 {
		font-size: 2em;
		margin-bottom: 1.2em;
	}

	.abilities .items h4 {
		font-size: 1em;
	}

	.abilities .export {
		padding: 2em;
	}

	.abilities .export h3 {
		font-size: 1.8em;
	}

	.abilities .export ul li {
		font-size: 1em;
	}

	.collab-content > p, .transitions-header p, .coming-soon-header p {
		font-size: 1em;
	}

	.collab-features li, .transition-features .feature {
		padding: 1.2em;
	}

	.footer {
		padding: 4em 2em;
	}
	
	.footer-logo-background img {
		width: 200%;
	}
	
	.footer-main {
		flex-direction: column;
		align-items: center;
		gap: 1.5em;
		text-align: center;
	}
	
	.creator-credit {
		margin-top: 1em;
		justify-content: center;
		align-items: center;
	}
	
	.transitions-dropdown {
		width: 280px;
	}
	
	.dropdown-grid {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media only screen and (max-width: 480px) {
	.welcome {
		font-size: 0.7rem;
		padding: 10em 0em 6em;

		& .btns {
			scale: 0.8;
		}
	}

	.abilities .export {
		padding: 1.5em;
	}

	.abilities .export h3 {
		font-size: 1.3em;
	}

	.abilities .export ul {
		padding: 0;
		gap: 1em;
	}

	.abilities .items .flex {
		gap: 1em;
	}

	.abilities .items .item {
		width: 100px;
		height: 80px;
		padding: 1em;
		gap: 0.4em;

		& img {
			width: 30px;
			height: 30px;
		}
	}

	.abilities .items .more .item-more video {
		width: 100%;
	}

	.abilities .export {
		gap: 2em;
	}

	.collaboration, .transitions, .coming-soon {
		padding: 3em 1.5em;
	}

	.collab-content h2, .transitions-header h2, .coming-soon-header h2 {
		font-size: 1.8em;
	}
	
	.coming-soon-header .feature-badge {
		display: block;
		margin: 0.5em auto 0;
		width: fit-content;
	}

	.collab-features, .transition-features {
		gap: 1em;
	}

	.collab-features .feature-icon, .transition-features .feature-icon {
		width: 40px;
		height: 40px;
	}

	.collab-features .feature-text h3, .transition-features .feature-content h3 {
		font-size: 1.1em;
	}

	.collab-features .feature-text p, .transition-features .feature-content p {
		font-size: 0.9em;
	}

	.transitions-gallery .transition-thumbnail {
		width: 50px;
		height: 35px;
	}
	
	.transitions-dropdown {
		width: 240px;
		right: -100px;
	}
	
	.dropdown-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.footer {
		padding: 3em 1.5em;
	}
	
	.footer-logo-background img {
		width: 250%;
	}
	
	.footer-links {
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}
	
	.creator-credit {
		flex-direction: column;
		gap: 0.8em;
	}
	
	.coming-soon-cta {
		flex-direction: column;
		gap: 1em;
	}
	
	.coming-soon-cta a {
		width: 100%;
		justify-content: center;
	}
}
`
