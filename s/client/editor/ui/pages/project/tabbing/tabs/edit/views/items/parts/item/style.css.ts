import {css} from "lit"

export default css`@layer view {

:host {
	display: flex;
	border: 2px solid #070707;
	background: black;
}

.item {
	background: #181818;
	border-radius: 5px;
}

.name {
	font-size: 14px;
	margin-left: 2px;
}

}`
