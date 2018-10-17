import {IApp, IVdomFragment} from "./index"

declare function toHtml(vdom: IApp | IVdomFragment): string
export = toHtml
