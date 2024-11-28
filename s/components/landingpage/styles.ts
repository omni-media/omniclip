import { css } from "lit";

export default css`

* {
	margin: 0;
}

@keyframes g-3 { 50% { --g3-1-x-position: 42.69531250000001%; --g3-1-y-position: 91.5625%; --g3-2-x-position: 91.7578125%; --g3-2-y-position: 33.046875%; --g3-3-x-position: 5.742187500000001%; --g3-3-y-position: 5.546875000000001%; } }

.landing-page {
	display: flex;
	flex-direction: column;
	font-size: 16px;
	color: #aaaaaa;
	background: rgba(0, 0, 0, 1);

	& nav {
		position: fixed;
		align-self: center;
		border-radius: 10px;
		margin: 1em;
		z-index: 10;
		display: flex;
		backdrop-filter: blur(5px);
		justify-content: space-between;
		align-items: center;

		& .try {
			display: flex;
			align-items: center;
			gap: 0.5em;
			background: white;
			color: black;
			padding: 0.3em 1em;
			border-radius: 5px;
			font-weight: bold;
			font-size: 16px;
		}

		.logo {
			padding: 1em 2em;
		}

		& .menu {
			display: none;
		}

		& .menu[data-opened] {
			display: flex;
			flex-direction: column;
			position: absolute;
			right: 20px;
			top: 50px;
			gap: 0.5em;
			border-radius: 20px;
			background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), #ffffff -80%, transparent), radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #431eaf -52%, transparent), #000000;
			padding: 1em;
			font-family: Poppins-Regular;
		}

		& a {
			text-decoration: none;
			color: white;
			cursor: pointer;
		}
		& img {
			width: 200px;
		}

		.menu-icon {
			width: 26px;
			display: none;
		}

		.nav {
			display: flex;
			align-items: center;
			padding: 1em 2em;
			gap: 3em;
		}

		& a {
			font-size: 1rem;
		}
	}


	* > p, h3, a {
		font-family: Poppins-Regular;
	}

	& h1 {
		color: white;

		& span {
			background-clip: text !important;
			font-family: Nippo-Regular;
			background: linear-gradient(180.2deg, #FFFFFF 29.5%, #848588 50.27%, #FFFFFF 72.49%);
		}
	}
	
	& h2 {
		font-family: Nippo-Regular;
		font-size: 3em;
		text-align: center;

		& span {
			font-weight: lighter;
			background-clip: text !important;
			-webkit-text-fill-color: transparent;
			background: linear-gradient(180.2deg, #FFFFFF 29.5%, #848588 50.27%, #FFFFFF 72.49%);
		}
	}

	footer {
		display: flex;
		justify-content: space-between;
		padding: 6em;
		background: rgba(255, 255, 255, 0.06);
		font-size: 0.9em;
		font-family: Poppins-Regular;

		--dotSize: 0.25rem;
		--bgSize: 1.35rem;
		--bgPosition: calc(var(--bgSize) / 2);

		background-image: radial-gradient(
				circle at center,
				black var(--dotSize),
				transparent 0
			), radial-gradient(circle at center, black var(--dotSize), transparent 0);
		background-size: var(--bgSize) var(--bgSize);
		background-position: 0 0, var(--bgPosition) var(--bgPosition);

		& div {
			display: flex;
			gap: 2em;
		}
	}
}

.welcome {
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: black 0px -5vw 15vw 5vw inset, black 0 -5vw 5vw 0 inset;
	gap: 2.5em;
	background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), #ffffff -80%, transparent), radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #431eaf -52%, transparent), #000000;
	animation-name: g-3;
	animation-iteration-count: infinite;
	animation-duration: 15s;
	transition-timing-function: ease-in-out;
	padding: 15em 3em;

	& h1 {
		text-transform: uppercase;
		max-width: 950px;
		text-align: center;
		line-height: 45px;
		font-size: 2rem;
	}
	
	& h2 {
		max-width: 650px;
		text-align: center;
		line-height: 25px;
		font-size: 0.9rem;
		font-weight: lighter;
		color: white;
		font-family: Poppins-ExtraLight;
		-webkit-text-fill-color: unset;

		& span {
			-webkit-text-fill-color: unset;
		}
	}

	& .logo {
		max-width: 500px;
		width: 100%;
		padding: 0 2em;
	}

	& p {
		color: white;
		padding: 0.5em 1em;
		border-radius: 100px;
		font-size: 1em;
		border: 1px solid white;
	}

	& .btns {
		display: flex;
		gap: 5px;
	}

	& .discord {
		font-weight: bold;
		border-radius: 6px;
		color: rgba(255, 255, 255, 1);
		border: 2px solid rgba(255, 255, 255, 1);
		font-size: 1rem;
		gap: 5px;
	}

	& .try {
		border: 2px solid rgba(255, 255, 255, 1);
		font-weight: bold;
		border-radius: 6px;
		background: rgba(255, 255, 255, 1);
		color: rgba(0, 0, 0, 1);
		font-size: 1rem;
	}

	& button, a {
		text-decoration: none;
		color: #aaaaaa;
		background: transparent;
		width: 200px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5em;
		border-radius: 6px;
		cursor: pointer;

		& svg {
			width: 24px;
		}
	} 
}

.abilities {
	background: black;
	padding: 3em;
	display: flex;
	justify-content: center;
	gap: 2em;
	flex-wrap: wrap;
	position: relative;
	flex-direction: column;
	align-items: center;

	& .ellipse-1 {
		background-image: url(/assets/ellipse-1.svg);
		position: absolute;
		background-size: contain;
		width: 450px;
		height: 450px;
		left: -250px;
	}

	& .ellipse-2 {
		background-image: url(/assets/ellipse-1.svg);
		position: absolute;
		background-size: contain;
		width: 450px;
		height: 450px;
		right: -250px;
		bottom: -100px;
	}

	& h2 {
		display: flex;
		justify-content: start;
		color: white;
		text-align: center;
		font-size: 2em;
		margin: 2em 0;
		line-height: 45px;
		flex-direction: column;
		text-transform: uppercase;
	}

	& .items {
		display: flex;
		flex-direction: column;
		gap: 1em;
		border-radius: 20px;
		flex-wrap: wrap;
		justify-content: center;
		text-align: center;

		& .flex {
			display: flex;
			justify-content: center;
			gap: 0.5em;
			flex-wrap: wrap;
		}

		& h4 {
			font-family: Poppins-ExtraLight;
			font-size: 0.8em;
		}

		& .more {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 3em;
			margin-top: 1em;

			& .flex {
				display: flex;
				flex-direction: column;
				gap: 1em;
			}

			& .item-more {

				& p {
					font-family: Poppins-ExtraLight;
					font-size: 0.8em;
				}

				& video, img {
					width: 300px;
					padding: 0.5em;
					border-radius: 20px;
				}
			}
		}

		& .item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100px;
			height: 80px;
			gap: 0.5em;
			padding: 1em 1.5em;
			border-radius: 20px;
			background: linear-gradient(307.26deg, #FFFFFF -21.65%, rgba(255, 255, 255, 0.14) -21.64%, rgba(255, 255, 255, 0.02) 99.38%);

			& img {
				width: 30px;
			}

			& h3 {
				color: rgba(255, 255, 255, 1);
				font-size: 1.3em;
				margin-bottom: 0.5em;
			}

			& p {
				color: rgba(255, 255, 255, 1);
				text-align: left;
				font-size: 0.95em;
				line-height: 25px;
			}
		}
	}

	& .export {
		display: flex;
		margin: 5em 0 5em 0;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 5em;
		padding: 2em;
		border-radius: 20px;
		color: white;
		background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), #ffffff -80%, transparent), radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #431eaf -52%, transparent), #000000;

		& video {
			max-width: 350px;
			width: 100%;
			border-radius: 20px;
		}

		& .emoji {
			font-family: "Noto Color Emoji";
		}

		& h3 {
			text-align: left;
			font-size: 1.5em;
		}

		& ul {
			display: flex;
			flex-direction: column;
			gap: 2em;
			align-items: self-start;
			font-family: Poppins-ExtraLight;
			margin-top: 2em;
			text-align: left;

			& li:last-child {
				font-weight: bold;
			}

			& .try {
				background: white;
				padding: 0.3em 1em;
				border-radius: 5px;
				font-size: 12px;
				text-decoration: none;
				color: black;
				margin-left: 0.5em;
			}
		}
	}
}

.differences {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	& h2 {
		color: white;
		margin: 2em 0 2em 0;
	}

	& .items {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 0 1em;

		& .gh {
			position: absolute;
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			align-items: center;
			justify-content: center;

			& .flex {
				display: flex;
				flex-direction: column;
				gap: 0.2em;
				align-items: center;
				backdrop-filter: blur(3px);
				transition: all 0.5s ease;
				padding: 1em;
				border-radius: 20px;
				border: 1px solid white;
				margin-top: 80px;

				&:hover {
					scale: 1.1;
				}
			}

			& a {
				color: white;
				text-decoration: none;
				font-weight: bold;
				font-size: 1.2em;
			}

			& .stars {
				width: 120px;
				height: 30px;
			}
		}

		& .free {

			& .emoji-1 {
				position: absolute;
				font-size: 150px;
				top: 30%;
				left: 10%;
			}

			& .emoji-2 {
				position: absolute;
				font-size: 150px;
				bottom: 0;
				right: 10%;
			}

			& .view {
				width: 100%;
				height: 100%;
				min-height: 300px;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 2;
				backdrop-filter: blur(50px);
			}

			& .try {
				background: radial-gradient(100% 100% at var(--g3-3-x-position) var(--g3-3-y-position), #FF9800 -80%, transparent), radial-gradient(100% 100% at var(--g3-1-x-position) var(--g3-1-y-position), #000000 -71%, transparent), radial-gradient(100% 100% at var(--g3-2-x-position) var(--g3-2-y-position), #FFC107 -52%, transparent), #CDDC39;
				color: white;
				font-weight: bold;
				padding: 0.5em 2em;
				border-radius: 5px;
				font-size: 1.5em;
				text-decoration: none;
				transition: all 0.5s ease;

				&:hover {
					scale: 1.1;
				}
			}
		}

		& .free, .open {
			min-width: 300px;

			& h3 {
				padding: 1em;
			}

			& p {
				padding-bottom: 1em; }
		}

		& .flex {
			display: flex;
			gap: 2em;
			flex-wrap: wrap;

			& .more {
				min-width: 250px;
				gap: 0.5em;
				padding: 1em;
				justify-content: space-between;
				background: linear-gradient(307.26deg, #FFFFFF -21.65%, rgba(255, 255, 255, 0.14) -21.64%, rgba(255, 255, 255, 0.02) 99.38%);

				& svg {
					width: 100px;
					height: 100px;
				}

			}
		}

		& .item {
			position: relative;
			display: flex;
			flex-direction: column;
			border-radius: 20px;
			align-items: center;
			background: linear-gradient(307.26deg, #FFFFFF -21.65%, rgba(255, 255, 255, 0.14) -21.64%, rgba(255, 255, 255, 0.02) 99.38%);
			flex: 1;

			& img {
				flex: 1;
				max-height: 400px;
				width: 100%;
				border-bottom-left-radius: 20px;
				border-bottom-right-radius: 20px;
			}

			& p {
				max-width: 300px;
				font-size: 0.8em;
				font-family: Poppins-ExtraLight;
				text-align: center;
			}
		}
	}
}

.soon {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: rgba(0, 0, 0, 1);
	position: relative;
	margin-bottom: 5em;

	& .ellipse-1 {
		background-image: url(/assets/ellipse.svg);
		background-size: contain;
		position: absolute;
		width: 984px;
		height: 984px;
		top: -780px;
	}

	& .ellipse-3 {
		background-image: url(/assets/ellipse-1.svg);
		position: absolute;
		background-size: contain;
		width: 450px;
		height: 450px;
		top: -280px;
	}

	& h2 {
		text-transform: uppercase;
		font-size: 2em;
		z-index: 5;
		margin: 4em 0 2em 0;
		color: white;
	}

	& .items {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		gap: 1em;

		& .api {

			& .concepts {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: start;
				gap: 1em;
				width: 100%;
				background: rgb(30, 30, 30);
				border-radius: 20px;

				& .concept:first-child {
					max-width: 500px;
				}

				& .concept:last-child {
					max-width: 350px;
				}

				& .concept {
					flex: 1 1 auto;
				}

				& img {
					border-radius: 20px;
				}
				
				& span {
					display: flex;
					position: absolute;
					align-items: center;
					background: white;
					padding: 0.2em 1em;
					color: black;
					margin: 0.5em;
					font-family: "Nippo-Regular";
					gap: 0.2em;
					border-radius: 20px;
				}
			}

			& img {
				height: auto;
				width: 100%;
			}
		}

		& .flex {
			display: flex;
			gap: 1em;
			flex-wrap: wrap;
		}

		& .item {
			align-self: stretch;
			min-width: 250px;
			padding: 1em;
			display: flex;
			align-items: center;
			flex: 1;
			flex-direction: column;
			border-radius: 20px;
			background: linear-gradient(307.26deg, #FFFFFF -21.65%, rgba(255, 255, 255, 0.14) -21.64%, rgba(255, 255, 255, 0.02) 99.38%);

			& h3 {
				font-size: 1.5em;
			}

			& .p-api {
				max-width: 500px;
				font-size: 0.8em;
				margin-bottom: 1em;
			}

			& .img-box {
				aspect-ratio: 16/9;
				display: flex;
				align-items: center;
				justify-content: center;

				& img {
					height: 100px;
					margin-bottom: 0.5em;
				}
			}

			& p {
				font-family: "Poppins-ExtraLight";
				text-align: center;
				line-height: 1.3rem;
			}
		}
	}
}

@media only screen and (max-width: 1200px) {
	.welcome {
		padding: 12em 3em;
		background-size: cover;
	}
	.core {
		gap: 4em;
	}
}

@media only screen and (max-width: 1024px) {
	.landing-page {
		nav {
			& .logo {
				padding: 1em 2em;
				width: 150px;
			}

			& .menu-icon {
				padding: 1em 2em;
				display: block;
			}

			& .nav {
				padding: 1em 2em;
				display: none;
			}
		}
	}
	.welcome {
		padding: 10em 3em;
		& h1 {
			font-size: 1.9rem;
		}
	}
}

@media only screen and (max-width: 768px) {
	.abilities {
		padding: 1em;
	}
	.soon {
		& h2 {
			margin: 3em 0 1em 0;
		}

		& .ellipse-1 {
			width: 500px;
			height: 500px;
			top: -390px;
		}

		& .ellipse-3 {
			width: 250px;
			height: 250px;
			top: -160px;
		}
	}

	.landing-page {
		nav {
			& .logo {
				width: 120px;
			}
		}
	}

	.welcome {
		& .try, .discord {
			font-size: 0.9rem;
		}
		& button, a {
			width: 150px;
			height: 40px;

			& svg {
				width: 20px;
			}
		}
		& h1 {
			line-height: 30px;
			font-size: 1.3rem;
		}

		& h2 {
			line-height: 20px;
			font-size: 0.8rem;
		}
	}

	.landing-page {
		& footer {
			align-items: center;
			flex-direction: column;
			gap: 1em;
		}
	}

}

@media only screen and (max-width: 640px) {
	.abilities {
		& h2 {
			margin: 1em 0;
		}
		& .export  {
			gap: 3em;
		}
	}
	.welcome {
		padding: 7em 3em;
	}

	.core .items .item p {
		width: auto;
	}
}

@media only screen and (max-width: 480px) {
	.differences {
		& .items .gh .flex {
			margin-top: 120px;
		}
	}

	.abilities {
		& .export {
			padding: 1.3em;

			& h3 {
				font-size: 1.2em;
			}
		}

		& .items .item {
			width: 80px;
			height: 60px;
		}

		& .items .more .item-more video {
			width: 280px;
		}

		& .export  {
			gap: 2em;
		}
	}

	.landing-page {
		& footer {
			padding: 2em;
		}
	}

	.welcome {
		& h1 {
			font-size: 1em;
		}

		& h2 {
			font-size: 0.7em;
		}

		padding: 5em 1em;

		& .try, .discord {
			font-size: 0.7rem;
			padding: 0;
		}
	}
}
`
