import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "index.css",
		title: "omni-clip",
		head: startup_scripts_with_dev_mode(path),
		body: html`
			<construct-editor></construct-editor>
		`,
	})
})
