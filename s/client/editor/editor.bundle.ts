
import {dom} from "@e280/sly"
import {EditorApp} from "./ui/app/component.js"
import {makeRouter} from "./ui/pages/router.js"

const router = makeRouter()

dom.register({EditorApp: EditorApp(router)})
