import {css} from "lit"

export const styles = css`
	:host {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100vw;
		background: rgba(0, 0, 0, 1);
		padding: 2em !important;
	}

	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Poppins-Regular;
		width: 1000px;
	}

	.projects {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		justify-content: center;
		flex-direction: column;

		& .collaboration {
			display: flex;
			flex-direction: column;
			gap: 1em;
			background: #0e0e0e;
			padding: 1em;
			align-self: center;
			border-radius: 10px;
			margin-bottom: 2em;

			& .title {
				display: flex;
				align-items: center;
				gap: 0.5em;
			}

			& .error, .creating {
				display: flex;
				gap: 0.5em;
			}

			& .join {
				font-size: 0.9em;
			}

			& svg {
				width: 20px;
				height: 20px;
			}

			& h3 {
				margin: 0;
			}

			& input {
				background: transparent;
				border: 1px solid gray;
				color: gray;
			}
		}

		& h1 {
			margin: 0;
			text-align: center;
		}

		& .flex {
			display: flex;
			gap: 1em;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;

			&:nth-of-type(2) {
				padding: 0 1em 1em 1em;
			}
		}


		& .new-project {
			flex-direction: column;

			& span {
				font-size: 14px;
			}

			& svg {
				color: gray;
			}

			&:hover {
				& svg {
					opacity: 1;
				}
			}
		}

		& .import-project {
			flex-direction: column;

			& span {
				font-size: 14px;
			}

			& label {
				display: flex;
			}

			&:hover {
				
				& svg {
					opacity: 1;
				}
			}

			& input {
				position: absolute;
				width: 100%;
				height: 100%;
				cursor: pointer;
				color: transparent;
			}

			& input[type=file]::file-selector-button {
				display: none;
			}
		}

		& .project, .new-project, .import-project {
			height: 200px;
			width: 200px;
			position: relative;
			border-radius: 10px;
			color: inherit;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #0e0e0e;
			text-decoration: none;
			flex-direction: column;
			transition: 0.5s all ease;
			gap: 0.3em;

			& .items {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				width: 100%;
				padding: 0.5em;

				& .export {
					background: none;
					border: none;
					color: gray;
					cursor: pointer;

					& svg {
						width: 20px;
						height: 20px;

						&:hover {
							opacity: 1;
						}
					}
				}
			}
			
			& .project-name {
				bottom: 0;
				right: 0;
				padding: 0.5em;
				z-index: 2;
				cursor: default;
			}

			& .remove {
				background: none;
				border: none;
				top: 0;
				right: 0;
				z-index: 2;
				color: gray;

				& .icon {
					display: flex;
					cursor: pointer;

					&:hover {
						color: red;
					}

					& svg {
						height: 20px;
						width: 20px;
					}
				}
			}

			.open {
				display: flex;
				color: inherit;
				height: 100%;
				width: 100%;
				align-items: center;
				justify-content: center;
				cursor: pointer;

				&:hover svg {
					opacity: 1;
				}
			}

			& .duration {
				cursor: default;
				top: 0;
				left: 0;
				z-index: 2;
			}

			& svg {
				width: 50px;
				height: 50px;
				opacity: 0.3;
				transition: 0.3s ease all;
			}
		}
	}

`
