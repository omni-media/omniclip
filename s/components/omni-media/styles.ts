import {css} from "@benev/slate"

export const styles = css`
	:host {
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow-y: scroll;
	}

	form {
		background: #111;
		position: fixed;
		padding: 1em;
		z-index: 5;
	}

	.placeholder {
		justify-content: center;
		align-items: center;

		& svg {
			width: 50px;
			height: 80px;
		}
	}

	.import-btn {
		display: flex;
		gap: 0.1em;
		letter-spacing: 0.5px;
		transition: opacity 0.5s ease 0s;
		color: gray;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}
	
	.hide {
		display: none;
	}

	.media {
		display: flex;
		padding: 1em;
		flex-wrap: wrap;
		gap: 1em;
		margin-top: 40px;

		& .box {
			align-self: start;
			aspect-ratio: 16/9;
			display: flex;
			flex-direction: column;
			min-width: 100px;
			flex: 25%;
			border: 1px solid #302f2f;
			border-radius: 2px;
			position: relative;

			& img {
				width: 100%;
				height: 100%;
				object-fit: fill;
			}

			& .media-element {
				position: relative;
				cursor: pointer;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				& .duration {
					display: flex;
					position: absolute;
					color: yellow;
					bottom: 0;
					left: 0;
				}

				& video {
					object-fit: fill;
					height: 100%;
					width: 100%;
				}

				& .add-btn {
					margin: 0.4em;
					display: none;
					background: #333;
					border-radius: 7px;

					& svg {
						color: lime;
					}
				}

				& .delete-btn {
					margin: 0.4em;
					display: none;
					background: #333;
					border-radius: 7px;
					
					& svg {
						color: red;
					}
				}

				& svg {
					width: 20px;
					height: 20px;
					opacity: 0.5;

					&:hover {
						opacity: 0.7;
					}
				}
			}

			& .audio {
				& svg:not(.add-btn svg, .delete-btn svg) {
					width: 35%;
					height: 35%;
				}
				&:hover {
					& svg:not(.add-btn svg, .delete-btn svg) {
						opacity: 0.7;
					}
				}
			}

			& .media-name {
				position: absolute;
				bottom: -12px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 100%;
				font-size: 0.6em;
			}

			&:hover {

				& .media-element {
					outline: 2px solid #3c3b3b;
					border-radius: 2px;
				}

				& .add-btn {
					display: flex;
					position: absolute;
					bottom: 0;
					right: 0;
				}

				& .delete-btn {
					display: flex;
					position: absolute;
					top: 0;
					right: 0;
				}
			}
		}
`
