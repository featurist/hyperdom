import {IVdomFragment, Binding, IApp} from "index"

// TODO: what else is there?
export interface RouteDefinition {
  definition: {
    pattern: string,
  }
}

export interface NotFound {
}

export interface IRouter {
  push(url: string): void

  reset(): void

  route(path: string): IRouteHandler

  url(): string

  notFound(handler: (url: string, routesTried: RouteDefinition[]) => string): NotFound
}

export interface IHistory {
  push(url: string): void

  url(): string
}

export interface ParamsToPushMap {
  [param: string]: boolean
}

export type ParamsToPushFn = (oldParams: object, newParams: object) => boolean
export type ParamsToPush = ParamsToPushMap | ParamsToPushFn

export interface ParamsBindings {
  [param: string]: Binding
}

export interface IRoutableComponent {
  bindings?: ParamsBindings
  push?: ParamsToPush

  redirect?(params: object): string | undefined

  render?(): IVdomFragment | IApp | string // TODO add `render() => string` test to hyperdomSpec
  // TODO: Promise<void> ?
  onload?(params: object): void
}

export interface IRouteHandler {
  (component: IRoutableComponent): IRoute

  isActive(params?: object): boolean

  push(options?: object): void

  url(params: object): string

  href(): string

  replace(): void
}

export interface Routes {
  [route: string]: IRouteHandler
}

export type IRoute = object

export function reset(): void

export function route(path: string): IRouteHandler

export function router(options: object): IRouter

export function hash(): IHistory

export function pushState(): IHistory
