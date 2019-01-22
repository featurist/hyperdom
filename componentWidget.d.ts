import {VdomFragment} from "./index"

type RenderFn<T> = (this: T, ...args: any[]) => VdomFragment

declare function componentWidget<T extends object> (state: T, vdom: VdomFragment | RenderFn<T>): any
declare function componentWidget (vdom: VdomFragment | RenderFn<undefined>): any
export = componentWidget
