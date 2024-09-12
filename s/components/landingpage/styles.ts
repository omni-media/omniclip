import { css } from "lit";

export default css`

* {
	margin: 0;
}

.landing-page {
	display: flex;
	flex-direction: column;
	font-size: 16px;
	color: #aaaaaa;
	background: rgba(0, 0, 0, 1);

	& nav {
		position: fixed;
		width: 100vw;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(0, 0, 0, 1);
		border-bottom: 1px solid;
		border-image-source: linear-gradient(90deg, rgba(168, 170, 173, 0) 0%, #A8AAAD 49.18%, rgba(168, 170, 173, 0) 100%);
		border-image-slice: 1;

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
			right: 0;
			top: 50px;
			gap: 0.5em;
			background: #00000061;
			padding: 1em;
			font-family: Poppins-Regular;
		}

		& a {
			text-decoration: none;
			color: inherit;
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
			gap: 2em;
		}

		& a {
			font-size: 1rem;
		}
	}


	* > p, h3, a {
		font-family: Poppins-Regular;
	}

	& h1 {
		& span {
			background-clip: text !important;
			-webkit-text-fill-color: transparent;
			font-family: Nippo-Regular;
			background: linear-gradient(180.2deg, #FFFFFF 29.5%, #848588 50.27%, #FFFFFF 72.49%);
		}
	}
	
	& h2 {
		font-family: Nippo-Regular;
		font-size: 3em;
		text-align: center;
		background-clip: text !important;
		-webkit-text-fill-color: transparent;
		background: linear-gradient(180.2deg, #FFFFFF 29.5%, #848588 50.27%, #FFFFFF 72.49%);
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
		padding: 3em;
		background: rgba(255, 255, 255, 0.06);
		font-size: 0.9em;
		font-family: Poppins-Regular;

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
	gap: 2.5em;
	padding: 15em 3em;
	background: rgba(0, 0, 0, 1);
	background-image: url(../assets/bg-hero.svg);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;

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
		padding: 0.5em 1em;
		border-radius: 100px;
		font-size: 1em;
		border: 2px solid transparent;
		background-clip: padding-box, border-box;
		border-image-slice: 1;
		background-image: linear-gradient(rgba(29, 29, 29, 1), rgba(29, 29, 29, 1)), linear-gradient(88.9deg, #FFFFFF 1.88%, #6F6F6F 51.1%, #FFFFFF 97.16%);
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

.core {
	background: rgba(15, 15, 15, 1);
	padding: 3em;
	display: flex;
	justify-content: center;
	gap: 10em;
	flex-wrap: wrap;
	position: relative;

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
		text-align: left;
		font-size: 2em;
		line-height: 45px;
		flex-direction: column;
		text-transform: uppercase;
	}

	& .items {
		display: flex;
		gap: 1em;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: start;
		justify-content: center;

		& .item:nth-child(2) {
			margin-left: 3em;
		}

		& .item {
			display: flex;
			align-items: start;
			height: 350px;
			gap: 1em;
			flex: 1;
			padding: 1.5em;
			border-radius: 4px;
			background: linear-gradient(307.26deg, #FFFFFF -21.65%, rgba(255, 255, 255, 0.14) -21.64%, rgba(255, 255, 255, 0.02) 99.38%);
			border-bottom: 1px solid;
			border-top: 1px solid;
			border-image-source: linear-gradient(90deg, rgba(168, 170, 173, 0) 0%, #A8AAAD 49.18%, rgba(168, 170, 173, 0) 100%);
			border-image-slice: 1;

			& h3 {
				color: rgba(255, 255, 255, 1);
				font-size: 1.3em;
				margin-bottom: 0.5em;
			}

			& p {
				width: 395px;
				color: rgba(255, 255, 255, 1);
				text-align: left;
				font-size: 0.95em;
				line-height: 25px;
			}
		}
	}
}

.capabilities {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: rgba(0, 0, 0, 1);
	padding: 0 3em 6em 3em;
	max-width: 1350px;
	align-self: center;
	z-index: 5;

	& h2 {
		text-transform: uppercase;
		font-size: 2em;
		margin: 3em;
	}

	& .items {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1em;

		& .item {
			align-self: stretch;
			padding: 1em;
			display: flex;
			align-items: start;
			flex: 30%;
			min-width: 250px;
			gap: 1em;
			flex-direction: column;
			border: 1px solid transparent;
			border-radius: 4px;
			background: linear-gradient(307.26deg, rgba(255, 255, 255, 0.5) -21.65%, rgba(255, 255, 255, 0.07) -21.64%, rgba(255, 255, 255, 0.01) 99.38%);

			& h3 {
				font-size: 1.5em;
			}

			& .img-box {
				width: 100%;
				aspect-ratio: 16/9;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1px solid;
				border-top: 1px solid;
				border-image-slice: 1;
				border-image-source: linear-gradient(270deg, rgba(160, 162, 165, 0) 0%, #A0A2A5 50.12%, rgba(160, 162, 165, 0) 97.31%);
				background: rgba(255, 255, 255, 0.06);
			}

			& img {
				width: 150px;
				aspect-ratio: 4/3;
			}

			& p {
				text-align: left;
				line-height: 1.3rem;
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
		margin: 2.5em 0;
	}

	& .items {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1em;
		padding: 3em 1em;

		& .item {
			align-self: stretch;
			min-width: 250px;
			padding: 1em;
			display: flex;
			align-items: start;
			flex: 1;
			gap: 1em;
			flex-direction: column;
			border: 1px solid;
			border-image-slice: 1;
			border-image-source: linear-gradient(210.49deg, rgba(160, 162, 165, 0) 0%, rgba(160, 162, 165, 0.6) 43.5%, rgba(160, 162, 165, 0) 100%);
			background: linear-gradient(307.26deg, rgba(255, 255, 255, 0.5) -21.65%, rgba(255, 255, 255, 0.07) -21.64%, rgba(255, 255, 255, 0.01) 99.38%);

			& h3 {
				font-size: 1.5em;
			}

			& .img-box {
				width: 100%;
				height: 100%;
				aspect-ratio: 16/9;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1px solid;
				border-top: 1px solid;
				border-image-slice: 1;
				border-image-source: linear-gradient(270deg, rgba(160, 162, 165, 0) 0%, #A0A2A5 50.12%, rgba(160, 162, 165, 0) 97.31%);
				background: rgba(255, 255, 255, 0.06);
			}

			& img {
				width: 150px;
				aspect-ratio: 4/3;
			}

			& p {
				text-align: left;
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
	.core {
		& .items {
			& .item:nth-child(2) {
				margin-left: 0;
			}
			& .item {
				margin: 0;
			}
		}
	}
}

@media only screen and (max-width: 768px) {
	.core {
		& .ellipse-1 {
			display: none;
		}
		& .ellipse-2 {
			width: 250px;
			height: 250px;
			top: -30px;
			right: -125px;
			bottom: -100px;
		}
		& h2 {
			font-size: 1.5em;
			line-height: 35px;
		}

		& .items {
			font-size: 0.9em;
		}
	}
	.capabilities {
		padding: 0 3em 3em 3em;

		& .items {
			font-size: 0.8em;
		}
		& h2 {
			font-size: 1.5em;
			margin: 1.5em;
		}
	}

	.soon {
		& .items {
			font-size: 0.8em;
		}
		& h2 {
			font-size: 1.3em;
			margin: 1.8em;
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
				width: 100px;
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
	.core {
		justify-content: start;
	}
	.welcome {
		padding: 7em 3em;
	}

	.core .items .item p {
		width: auto;
	}
}

@media only screen and (max-width: 480px) {
	.landing-page {
		& footer {
			padding: 2em;
		}
	}
	.welcome {
		padding: 5em 1em;

		& .try, .discord {
			font-size: 0.7rem;
			padding: 0;
		}
	}

	.core {
		padding: 3em 1em;
	}

	.capabilities {
		padding: 0 1em 1em 1em;
	}
}
`
