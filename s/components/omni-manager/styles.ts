import {css} from "lit"

export const styles = css`
	:host {
		display: flex;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		background: rgba(0, 0, 0, 1);
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

		& .new-project {
			& svg {
				color: gray;
			}

			&:hover {
				& svg {
					opacity: 1;
				}
			}
		}

		& .project, .new-project {
			height: 200px;
			width: 200px;
			position: relative;
			border-radius: 10px;
			color: inherit;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 200px;
			height: 200px;
			background: #0e0e0e;
			
			& .project-name {
				position: absolute;
				bottom: 0;
				right: 0;
				padding: 0.5em;
				z-index: 2;
				cursor: default;
			}

			& .remove {
				position: absolute;
				background: none;
				border: none;
				top: 0;
				right: 0;
				padding: 1em;
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
				position: absolute;
				top: 0;
				left: 0;
				padding: 0.7em;
				z-index: 2;
			}

			& svg {
				width: 50px;
				height: 50px;
				opacity: 0.3;
			}
		}
	}

`
