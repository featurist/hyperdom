import {VdomFragment, Binding, App} from "index"

// TODO: what else is there?
export interface RouteDefinition {
  definition: {
    pattern: string,
  }
}

export type NotFound = object

export interface Router {
  push(url: string): void

  reset(): void

  route(path: string): RouteHandler

  url(): string

  notFound(handler: (url: string, routesTried: RouteDefinition[]) => string): NotFound
}

export interface RouteHistory {
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

export interface RoutableComponent {
  bindings?: ParamsBindings
  push?: ParamsToPush

  redirect?(params: object): string | undefined

  render?(): VdomFragment | App | string // TODO add `render() => string` test to hyperdomSpec
  // TODO: Promise<void> ?
  onload?(params: object): void
}

export interface RouteHandler {
  (component: RoutableComponent): Route

  isActive(params?: object): boolean

  push(options?: object): void

  url(params: object): string

  href(): string

  replace(): void
}

export interface Routes {
  [route: string]: RouteHandler
}

export type Route = object

export function reset(): void

export function route(path: string): RouteHandler

export function router(options: object): Router

export function hash(): RouteHistory

export function pushState(): RouteHistory
