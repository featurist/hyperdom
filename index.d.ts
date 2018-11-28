import * as router from "router"

// tslint:disable-next-line
declare namespace hyperdom {

  export interface VdomFragment {
    children: any[]
  }

  abstract class HyperdomApp {
    public refreshImmediately (): void
    public refreshComponent (): void
    public refresh (): void
  }

  export abstract class RenderApp extends HyperdomApp {
    public abstract render (): VdomFragment | App
  }

  export abstract class RoutesApp extends HyperdomApp {
    public abstract routes (): router.Route[]

    protected renderLayout (content: any): VdomFragment | App
  }

  export type App = RoutesApp | RenderApp

  interface DomAttachement {
    remove (): void

    detach (): void
  }

  export interface MountOpts {
    requestRender?: (render: () => void) => void
    window?: Window
    document?: Document
    router?: typeof router
  }

  export interface ObjectBinding {
    get (): any

    set (value: any): void
  }

  // TODO what about Promise<void> ?
  export type SimpleBinding = [object, string] | [object, string, (param: string | number) => any]

  export type Binding = ObjectBinding | SimpleBinding

  export type AppFn = (model?: any) => VdomFragment

  export function append (root: HTMLElement, app: App | AppFn, opts?: MountOpts): DomAttachement

  export function replace (root: HTMLElement, app: App | AppFn, opts?: MountOpts): DomAttachement

  interface ModelMeta {
    error: {
      message: string,
    }
  }

  export interface NodeProps {
    // TODO: enumarate all possible keys instead
    [key: string]: string | number | object | boolean | undefined | null

    binding?: Binding

    onclick? (): void
  }

  // This is to support hyperdom-babel-preset string binding. Not covered by tests.
  export interface JsxNodeProps {
    [key: string]: string | number | object | boolean | undefined | null

    binding?: Binding | string

    onclick? (): void
  }

  // TODO Date?
  export type Renderable = string | number | boolean | undefined | null | VdomFragment | App

  const html: {
    (tag: string, nodeProps: NodeProps, ...children: Renderable[]): VdomFragment,
    (tag: string, ...children: Renderable[]): VdomFragment,

    rawHtml (tag: string, ...children: Renderable[]): VdomFragment,
    refresh (component?: object): void
    refreshAfter (promise?: Promise<any>): void
    meta (model: object, property: string): ModelMeta,
  }
  export {html}

  // TODO combine with the one above
  export function rawHtml (tag: string, ...children: Renderable[]): VdomFragment
  export function rawHtml (tag: string, nodeProps: NodeProps, ...children: Renderable[]): VdomFragment

  export function viewComponent (app: App): VdomFragment

  export function appendVDom (root: VdomFragment, app: App | AppFn): DomAttachement

  const jsx: (
    tag: string | { new(...params: any[]): App },
    nodeProps: JsxNodeProps | undefined,
    children?: Renderable | Renderable[],
  ) => VdomFragment
  export {jsx}

  export function norefresh (): void

  export function refreshify (fn: () => void, opts?: object): () => void

  export function binding (opts: object): void
}

export = hyperdom
