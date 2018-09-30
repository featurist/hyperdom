// tslint:disable-next-line
declare namespace hyperdom {
  export type VdomFragment = object
  export type TextContent = string
  export type NodeAttributes = object

  export interface IApp {
    render(): VdomFragment
  }

  interface IAttachement {
    remove(): void
    detach(): void
  }

  export interface IMountOpts {
    requestRenderer?: () => void
    window?: Window
    document?: Document
    // TODO router?: Router
  }

  export function append(root: HTMLElement, app: IApp, opts?: IMountOpts): IAttachement
  export function replace(root: HTMLElement, app: IApp, opts?: IMountOpts): IAttachement
  export function html(
    tag: string, ...children: Array<VdomFragment | TextContent>,
  ): VdomFragment
  // export function html(
  //   tag: string, opts: NodeAttributes, ...children: Array<VdomFragment | TextContent>,
  // ): VdomFragment
  // TODO:
  // exports.html.refreshify = render.refreshify
  // exports.rawHtml = rendering.rawHtml
  // exports.jsx = rendering.jsx
  // exports.replace = rendering.replace
  // exports.append = rendering.append
  // exports.appendVDom = rendering.appendVDom
  // exports.binding = require('./binding')
  // exports.meta = require('./meta')
  // exports.refreshify = render.refreshify
  // exports.norefresh = require('./refreshEventResult').norefresh
  // exports.join = require('./join')
  // exports.viewComponent = viewComponent
}

export = hyperdom
