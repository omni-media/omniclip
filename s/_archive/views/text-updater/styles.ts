import {css} from "@benev/slate"

export const styles = css`
	:host {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.text-selector {
		position: fixed;
		z-index: 999;
		display: flex;
		border-radius: 5px;
		background: #00000059;
		padding: 0.5em;
		margin-top: 2em;
		flex-direction: column;

		.tooltip {
			display:inline-block;
			position:relative;
			text-align:left;
			align-items: end;
			gap: 0.3em;
			font-size: 12px;
			outline: none;

			& img {
				width: 220px;
				border-radius: 2px;
				border: 2px solid red;
				margin-top: 0.2em;
			}

			&:hover {
				outline: none !important;
				cursor: default !important;
			}

			& .top {
				min-width:230px; 
				top:-20px;
				left:50%;
				transform:translate(-50%, -100%);
				padding:10px 20px;
				color:#444444;
				background-color:#EEEEEE;
				font-weight:normal;
				font-size:13px;
				border-radius:8px;
				position:absolute;
				z-index:99999999;
				box-sizing:border-box;
				box-shadow:0 1px 8px rgba(0,0,0,0.5);
				display:none;

				& h3 {
					font-size: 13px;
				}

				& p {
					font-size: 12px;
				}
			}

			&:hover .top {
				display:block;
			}

			& .top i {
				position:absolute;
				top:100%;
				left:50%;
				margin-left:-12px;
				width:24px;
				height:12px;
				overflow:hidden;
			}

			& .top i::after {
				content:'';
				position:absolute;
				width:12px;
				height:12px;
				left:50%;
				transform:translate(-50%,-50%) rotate(45deg);
				background-color:#EEEEEE;
				box-shadow:0 1px 8px rgba(0,0,0,0.5);
			}

			& svg {
				width: 20px;
				height: 20px;
				color: yellow;
			}
		}

		& [data-selected] {
			background: rgb(32, 31, 31);
		}
		
		& .flex-column {
			display: flex;
			flex-direction: column;
			gap: 0.3em;
		}

		& .flex {
			display: flex;
			align-items: center;
		}

		& .flex-hover {
			display: flex;
			gap: 0.3em;

			& > * {
				display: flex;
				padding: 0.2em;
				border-radius: 5px;
				cursor: pointer;

				&:hover {
					outline: 1px solid #FFFFFF88;
				}

			}
		}

		& label {
			font-weight: bold;
		}

		& select {
			background: rgb(32, 31, 31);
			border: none;
			padding: 0.5em;
			border-radius: 5px;
			color: inherit;
			width: 80%;
			cursor: pointer;
		}

		& svg {
			padding: 0.2em;
			width: 30px;
			height: 30px;
		}

		& .font-size {
			background: rgb(32, 31, 31);
			border: none;
			border-radius: 5px;
			padding: 0.5em;
			color: inherit;
			width: 20%;
			text-align: center;
		}

		& .content {
			background: rgb(32, 32, 32);
			border: none;
			border-radius: 5px;
			color: white;
			padding: 0.3em;
		}

		& .color-picker {
			display: flex;
			gap: 0.5em;
			padding: 0.5em;

			& span {
				font-weight: bold;
				width: 65px;
			}

			& .picker {
				width: 25px;
				height: 25px;
				border-radius: 100%;
				background: blue;
				cursor: pointer;
				
				&::-webkit-color-swatch {
					border: none;
				}
			}
		}
	}
	
	h2 {
		padding: 0.3em;
	}

	.not-selected {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		font-size: 1.5em;
	}

	.add-text {
		padding: 0.5em;
		margin: 1em;
		background: rgb(32, 31, 31);
		margin-top: 1em;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: bold;

		&:hover {
			opacity: 0.7;
			color: white;
		}
	}

`
