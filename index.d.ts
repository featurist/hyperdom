// tslint:disable-next-line
declare namespace hyperdom {
  export type TextContent = string
  export type NodeAttributes = object
  type ComponentWidget = object

  export interface IVdomFragment {
    children: any[]
  }

  export interface IApp {
    render(): IVdomFragment
  }

  interface IAttachement {
    remove(): void
    detach(): void
  }

  export interface IMountOpts {
    requestRender?: (render: () => void) => void
    window?: Window
    document?: Document
  }

  export interface INodeProps {
    onclick(): void
  }

  export function append(root: HTMLElement, app: IApp, opts?: IMountOpts): IAttachement
  export function replace(root: HTMLElement, app: IApp, opts?: IMountOpts): IAttachement

  const html: {
    (
      tag: string,
      nodeProps: INodeProps,
      ...children: Array<ComponentWidget | IVdomFragment | TextContent | undefined>,
    ): IVdomFragment,
    (
      tag: string,
      ...children: Array<ComponentWidget | IVdomFragment | TextContent | undefined>,
    ): IVdomFragment,

    rawHtml(
      tag: string,
      ...children: Array<ComponentWidget | IVdomFragment | TextContent | undefined>,
    ): IVdomFragment,
  }
  export {html}

  export function viewComponent(app: IApp): any
}

export = hyperdom
