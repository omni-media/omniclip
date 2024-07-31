import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"
export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "index.css",
		title: "omni-clip",
		head: html`
			<script src="coi-serviceworker.js"></script>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<script type="importmap-shim" src="./importmap.json"></script>
			<script defer src="./node_modules/es-module-shims/dist/es-module-shims.js"></script>
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
			<landing-page></landing-page>
			`
	})
})
