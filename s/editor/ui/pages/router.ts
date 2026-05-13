
import {derived, type DerivedFn, type SignalFn} from "@e280/strata"
import {router, hashNav, hashSignal, type Content} from "@e280/sly"

import {AboutPage} from "./about/view.js"
import {AccountPage} from "./account/view.js"
import {UnknownPage} from "./unknown/view.js"
import {ProjectPage} from "./project/view.js"
import {ProjectsPage} from "./projects/view.js"

export type AppRouter = {
	$hash: SignalFn<string>
	go: {
		home: () => void
		account: () => void
		projects: () => void
		project: (projectId: string) => void
	}
	href: {
		home: () => string
		account: () => string
		projects: () => string
		project: (projectId: string) => string
	}
	$content: DerivedFn<Content>
}

export const makeRouter = (): AppRouter => {
	const paths = {
		home: () => "",
		account: () => "account",
		projects: () => "projects",
		project: (projectId: string) => `project/${projectId}`,
	}

	const $hash = hashSignal() as unknown as SignalFn<string>

	const appRouter = {
		$hash,
		go: hashNav(paths),
		href: {
			home: () => "#/",
			account: () => "#/account",
			projects: () => "#/projects",
			project: (projectId: string) => `#/project/${projectId}`,
		},
	} as AppRouter

	const route = router({
		"": () => AboutPage(),
		"account": () => AccountPage(),
		"projects": () => ProjectsPage(appRouter)(),
		"project/{projectId}": ({projectId}) => ProjectPage(appRouter, projectId),
	})

	appRouter.$content = derived(() => route($hash()) ?? UnknownPage())

	return appRouter
}

