import {template, html, easypage} from "@benev/turtle"
export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "index.css",
		title: "omniclip",
		head: html`
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/dark.css" />
			<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/shoelace.js" ></script>
			<!-- adding pixijs here because pixijs/filters work this way
				(because pixijs/filters does some global stuff work which
				doesnt seem to work when installing pixi through package json),
				but also adding pixijs to package json for types  -->
			<script src="https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/dist/pixi.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/pixi-filters@5.3.0/dist/browser/pixi-filters.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@pixi/graphics-extras@7.1.4/dist/graphics-extras.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@pixi-essentials/object-pool@1.0.1/dist/pixi-object-pool.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@pixi-essentials/bounds@3.0.0/dist/bounds.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@pixi-essentials/transformer@3.0.2/dist/transformer.js"></script>
			<!-- <script src="https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.min.js"></script> -->
			<!-- <script src="https://cdn.jsdelivr.net/npm/pixi-filters@6.1.0/dist/pixi-filters.min.js"></script> -->
			<script src="coi-serviceworker.js"></script>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<script type="importmap-shim" src="./importmap.json"></script>
			<script defer src="https://cdn.jsdelivr.net/npm/es-module-shims@1.8.2/dist/es-module-shims.min.js"></script>
			<script type="module-shim" src="./main.js"></script>
			<link rel="stylesheet" href="index.css">
			<link rel="icon" type="image/png" sizes="32x32" href="./assets/favicon-32x32.png">
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;400;500;700;800&display=swap" rel="stylesheet">
			<title>omni-clip</title>
		`,
		body: html`
			<div class="loading-page-indicator">
				<img class="logo-loader" src="/assets/icon3.png" />
				<div class="loader"><div class="loaderBar"></div></div>
			</div>
		`
	})
})
