import {css} from "@benev/slate"

export const styles = css`
	.import-btn {
		padding: 0.2em 0.4em;
		transition: opacity 0.5s ease 0s;
		background: var(--alpha);
		color: var(--bg-b);
		cursor: pointer;
		margin: 1em;

		&:hover {
			opacity: 0.8;
		}
	}

	.media {
		display: flex;
		margin: 1em;
		flex-wrap: wrap;
		gap: 1em;

		& .box {
			display: flex;
			flex-direction: column;
			max-width: 250px;
			min-width: 100px;
			flex: 1;
			position: relative;

			& .media-element {
				position: relative;
				cursor: pointer;

				& .duration {
					display: flex;
					position: absolute;
					color: yellow;
					bottom: 0;
					left: 0;
				}

				& video {
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
					width: 25px;
					height: 25px;
					opacity: 0.5;

					&:hover {
						opacity: 0.7;
					}
				}
			}

			& .media-name {
				position: absolute;
				bottom: -10px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 100%;
				font-size: 0.7em;
			}

			&:hover {

				& video {
					outline: 2px solid gray;
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
