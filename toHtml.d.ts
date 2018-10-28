import {App, VdomFragment} from "./index"

declare function toHtml(vdom: App | VdomFragment): string
export = toHtml
