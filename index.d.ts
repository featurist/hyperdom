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
    [key: string]: string | number | object | boolean | undefined | null

    binding?: Binding

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

  export function rawHtml (tag: string, ...children: Renderable[]): VdomFragment
  export function rawHtml (tag: string, nodeProps: NodeProps, ...children: Renderable[]): VdomFragment

  export function viewComponent (app: App): VdomFragment

  export function appendVDom (root: VdomFragment, app: App | AppFn): DomAttachement

  const jsx: (
    tag: string | { new(...params: any[]): App },
    nodeProps: NodeProps | undefined,
    children?: Renderable | Renderable[],
  ) => VdomFragment
  export {jsx}

  export function norefresh (): void

  export function refreshify (fn: () => void, opts?: object): () => void

  export function binding (opts: object): void
}

export = hyperdom

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML
      a: Partial<HTMLAnchorElement>
      abbr: Partial<HTMLElement>
      address: Partial<HTMLElement>
      area: Partial<HTMLAreaElement>
      article: Partial<HTMLElement>
      aside: Partial<HTMLElement>
      audio: Partial<HTMLAudioElement>
      b: Partial<HTMLElement>
      base: Partial<HTMLBaseElement>
      bdi: Partial<HTMLElement>
      bdo: Partial<HTMLElement>
      big: Partial<HTMLElement>
      blockquote: Partial<HTMLElement>
      body: Partial<HTMLBodyElement>
      br: Partial<HTMLBRElement>
      button: Partial<HTMLButtonElement>
      canvas: Partial<HTMLCanvasElement>
      caption: Partial<HTMLElement>
      cite: Partial<HTMLElement>
      code: Partial<HTMLElement>
      col: Partial<HTMLTableColElement>
      colgroup: Partial<HTMLTableColElement>
      data: Partial<HTMLElement>
      datalist: Partial<HTMLDataListElement>
      dd: Partial<HTMLElement>
      del: Partial<HTMLElement>
      details: Partial<HTMLElement>
      dfn: Partial<HTMLElement>
      dialog: Partial<HTMLDialogElement>
      div: Partial<HTMLDivElement>
      dl: Partial<HTMLDListElement>
      dt: Partial<HTMLElement>
      em: Partial<HTMLElement>
      embed: Partial<HTMLEmbedElement>
      fieldset: Partial<HTMLFieldSetElement>
      figcaption: Partial<HTMLElement>
      figure: Partial<HTMLElement>
      footer: Partial<HTMLElement>
      form: Partial<HTMLFormElement>
      h1: Partial<HTMLHeadingElement>
      h2: Partial<HTMLHeadingElement>
      h3: Partial<HTMLHeadingElement>
      h4: Partial<HTMLHeadingElement>
      h5: Partial<HTMLHeadingElement>
      h6: Partial<HTMLHeadingElement>
      head: Partial<HTMLHeadElement>
      header: Partial<HTMLElement>
      hgroup: Partial<HTMLElement>
      hr: Partial<HTMLHRElement>
      html: Partial<HTMLHtmlElement>
      i: Partial<HTMLElement>
      iframe: Partial<HTMLIFrameElement>
      img: Partial<HTMLImageElement>
      input: Partial<HTMLInputElement>
      ins: Partial<HTMLModElement>
      kbd: Partial<HTMLElement>
      keygen: Partial<HTMLElement>
      label: Partial<HTMLLabelElement>
      legend: Partial<HTMLLegendElement>
      li: Partial<HTMLLIElement>
      link: Partial<HTMLLinkElement>
      main: Partial<HTMLElement>
      map: Partial<HTMLMapElement>
      mark: Partial<HTMLElement>
      menu: Partial<HTMLElement>
      menuitem: Partial<HTMLElement>
      meta: Partial<HTMLMetaElement>
      meter: Partial<HTMLElement>
      nav: Partial<HTMLElement>
      noindex: Partial<HTMLElement>
      noscript: Partial<HTMLElement>
      object: Partial<HTMLObjectElement>
      ol: Partial<HTMLOListElement>
      optgroup: Partial<HTMLOptGroupElement>
      option: Partial<HTMLOptionElement>
      output: Partial<HTMLElement>
      p: Partial<HTMLParagraphElement>
      param: Partial<HTMLParamElement>
      picture: Partial<HTMLElement>
      pre: Partial<HTMLPreElement>
      progress: Partial<HTMLProgressElement>
      q: Partial<HTMLQuoteElement>
      rp: Partial<HTMLElement>
      rt: Partial<HTMLElement>
      ruby: Partial<HTMLElement>
      s: Partial<HTMLElement>
      samp: Partial<HTMLElement>
      script: Partial<HTMLScriptElement>
      section: Partial<HTMLElement>
      select: Partial<HTMLSelectElement>
      small: Partial<HTMLElement>
      source: Partial<HTMLSourceElement>
      span: Partial<HTMLSpanElement>
      strong: Partial<HTMLElement>
      style: Partial<HTMLStyleElement>
      sub: Partial<HTMLElement>
      summary: Partial<HTMLElement>
      sup: Partial<HTMLElement>
      table: Partial<HTMLTableElement>
      tbody: Partial<HTMLTableSectionElement>
      td: Partial<HTMLTableDataCellElement>
      textarea: Partial<HTMLTextAreaElement>
      tfoot: Partial<HTMLTableSectionElement>
      th: Partial<HTMLTableHeaderCellElement>
      thead: Partial<HTMLTableSectionElement>
      time: Partial<HTMLElement>
      title: Partial<HTMLTitleElement>
      tr: Partial<HTMLTableRowElement>
      track: Partial<HTMLTrackElement>
      u: Partial<HTMLElement>
      ul: Partial<HTMLUListElement>
      "var": Partial<HTMLElement>
      video: Partial<HTMLVideoElement>
      wbr: Partial<HTMLElement>
      // webview: Partial<HTMLWebViewElement>

      // Partial<SVG>
      svg: Partial<SVGSVGElement>

      animate: Partial<SVGElement>
      animateTransform: Partial<SVGElement>
      circle: Partial<SVGCircleElement>
      clipPath: Partial<SVGClipPathElement>
      defs: Partial<SVGDefsElement>
      desc: Partial<SVGDescElement>
      ellipse: Partial<SVGEllipseElement>
      feBlend: Partial<SVGFEBlendElement>
      feColorMatrix: Partial<SVGFEColorMatrixElement>
      feComponentTransfer: Partial<SVGFEComponentTransferElement>
      feComposite: Partial<SVGFECompositeElement>
      feConvolveMatrix: Partial<SVGFEConvolveMatrixElement>
      feDiffuseLighting: Partial<SVGFEDiffuseLightingElement>
      feDisplacementMap: Partial<SVGFEDisplacementMapElement>
      feDistantLight: Partial<SVGFEDistantLightElement>
      feFlood: Partial<SVGFEFloodElement>
      feFuncA: Partial<SVGFEFuncAElement>
      feFuncB: Partial<SVGFEFuncBElement>
      feFuncG: Partial<SVGFEFuncGElement>
      feFuncR: Partial<SVGFEFuncRElement>
      feGaussianBlur: Partial<SVGFEGaussianBlurElement>
      feImage: Partial<SVGFEImageElement>
      feMerge: Partial<SVGFEMergeElement>
      feMergeNode: Partial<SVGFEMergeNodeElement>
      feMorphology: Partial<SVGFEMorphologyElement>
      feOffset: Partial<SVGFEOffsetElement>
      fePointLight: Partial<SVGFEPointLightElement>
      feSpecularLighting: Partial<SVGFESpecularLightingElement>
      feSpotLight: Partial<SVGFESpotLightElement>
      feTile: Partial<SVGFETileElement>
      feTurbulence: Partial<SVGFETurbulenceElement>
      filter: Partial<SVGFilterElement>
      foreignObject: Partial<SVGForeignObjectElement>
      g: Partial<SVGGElement>
      image: Partial<SVGImageElement>
      line: Partial<SVGLineElement>
      linearGradient: Partial<SVGLinearGradientElement>
      marker: Partial<SVGMarkerElement>
      mask: Partial<SVGMaskElement>
      metadata: Partial<SVGMetadataElement>
      path: Partial<SVGPathElement>
      pattern: Partial<SVGPatternElement>
      polygon: Partial<SVGPolygonElement>
      polyline: Partial<SVGPolylineElement>
      radialGradient: Partial<SVGRadialGradientElement>
      rect: Partial<SVGRectElement>
      stop: Partial<SVGStopElement>
      switch: Partial<SVGSwitchElement>
      symbol: Partial<SVGSymbolElement>
      text: Partial<SVGTextElement>
      textPath: Partial<SVGTextPathElement>
      tspan: Partial<SVGTSpanElement>
      use: Partial<SVGUseElement>
      view: Partial<SVGViewElement>
    }
  }
}
