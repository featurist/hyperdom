import { IApp, IVdomFragment } from "index"

export interface IRoutes {
    routes(): Array<IRoute>
    renderLayout?(content: any): IVdomFragment
}

export type IRoute = object
export function reset(): void
export type RouteHandler = (app: IApp) => IRoute
export function route(path: string): RouteHandler