import * as router from "router"

// tslint:disable-next-line
declare namespace hyperdom {
  export type TextContent = string
  type ComponentWidget = object

  export interface IVdomFragment {
    children: any[]
  }

  export interface IApp {
    render(): IVdomFragment | IApp
    [key: string]: any
  }

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

  export interface IBinding {
    get(): any
    set(value: any): void
  }

  export interface INodeProps {
    onclick?(): void
    binding?: IBinding
    [key: string]: any
  }

  export type AppFn = (model?: any) => IVdomFragment
  export function append(root: HTMLElement, app: IApp | AppFn | router.IRoutes, opts?: IMountOpts): IAttachement
  export function replace(root: HTMLElement, app: IApp | AppFn, opts?: IMountOpts): IAttachement

  interface IModelMeta {
    error: {
      message: string
    }
  }

  const html: {
    (tag: string, nodeProps: INodeProps, ...children: Array<any>): IVdomFragment,
    (tag: string, ...children: Array<any>): IVdomFragment,

    rawHtml(tag: string, ...children: Array<any>): IVdomFragment,
    refresh(component?: any): void
    refreshAfter(promise?: Promise<any>): void
    meta(model: any, property: string): IModelMeta
  }
  export {html}

  // TODO combine with the one above
  export function rawHtml(tag: string, ...children: Array<any>): IVdomFragment

  export function viewComponent(app: IApp): any
  export function appendVDom(root: IVdomFragment, app: IApp | AppFn): IAttachement

  const jsx: {
    (
      tag: string | { new(...params: any[]): IApp },
      nodeProps?: INodeProps,
      ...children: Array<any>,
    ): IVdomFragment,
  }
  export {jsx}

  export function norefresh(): void
  export function refreshify(fn: () => void, opts?: object): () => void

  export function binding(opts: object): void
}

export = hyperdom
