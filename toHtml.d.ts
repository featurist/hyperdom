import {Component, VdomFragment} from "./index"

declare function toHtml (vdom: Component | VdomFragment): string
export = toHtml
