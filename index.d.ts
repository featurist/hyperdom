import * as router from "router"

// tslint:disable-next-line
declare namespace hyperdom {

  export interface IVdomFragment {
    children: any[]
  }

  export interface IRenderApp {
    render(): IVdomFragment | IApp

    [key: string]: any
  }

  export interface IRoutesApp {
    routes(): router.IRoute[]

    renderLayout?(content: any): IVdomFragment | IApp

    [key: string]: any
  }

  export type IApp = IRoutesApp | IRenderApp

  interface IAttachement {
    remove(): void

    detach(): void
  }

  export interface IMountOpts {
    requestRender?: (render: () => void) => void
    window?: Window
    document?: Document
    router?: typeof router
  }

  export interface ObjectBinding {
    get(): any

    set(value: any): void
  }

  // TODO what about Promise<void> ?
  export type SimpleBinding = [object, string] | [object, string, (param: string | number) => void]

  export type Binding = ObjectBinding | SimpleBinding

  export interface INodeProps {
    [key: string]: any

    binding?: Binding

    onclick?(): void
  }

  export type AppFn = (model?: any) => IVdomFragment

  export function append(root: HTMLElement, app: IApp | AppFn, opts?: IMountOpts): IAttachement

  export function replace(root: HTMLElement, app: IApp | AppFn, opts?: IMountOpts): IAttachement

  interface IModelMeta {
    error: {
      message: string,
    }
  }

  // TODO Date?
  export type Renderable = string | number | boolean | undefined | null | IVdomFragment | IApp

  const html: {
    (tag: string, nodeProps: INodeProps, ...children: Renderable[]): IVdomFragment,
    (tag: string, ...children: Renderable[]): IVdomFragment,

    rawHtml(tag: string, ...children: Renderable[]): IVdomFragment,
    refresh(component?: any): void
    refreshAfter(promise?: Promise<any>): void
    meta(model: any, property: string): IModelMeta,
  }
  export {html}

  // TODO combine with the one above
  export function rawHtml(tag: string, ...children: Renderable[]): IVdomFragment
  export function rawHtml(tag: string, nodeProps: INodeProps, ...children: Renderable[]): IVdomFragment

  export function viewComponent(app: IApp): any

  export function appendVDom(root: IVdomFragment, app: IApp | AppFn): IAttachement

  const jsx: (
    tag: string | { new(...params: any[]): IApp },
    nodeProps: INodeProps | undefined,
    children?: Renderable | Renderable[],
  ) => IVdomFragment
  export {jsx}

  export function norefresh(): void

  export function refreshify(fn: () => void, opts?: object): () => void

  export function binding(opts: object): void
}

export = hyperdom
