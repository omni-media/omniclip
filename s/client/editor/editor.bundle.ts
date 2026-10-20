
import {dom} from "@e280/sly"
import {setupAuth} from "./ui/logic/auth.js"
import {EditorApp} from "./ui/app/component.js"
import {makeRouter} from "./ui/pages/router.js"

setupAuth()
const router = makeRouter()

dom.register({EditorApp: EditorApp(router)})
