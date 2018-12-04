import * as router from "router"

// tslint:disable-next-line
declare namespace hyperdom {

  export interface VdomFragment {
    children: any[]
  }

  abstract class HyperdomComponent {
    public refreshImmediately (): void
    public refreshComponent (): void
    public refresh (): void
  }

  export abstract class RenderComponent extends HyperdomComponent {
    public abstract render (): VdomFragment | Component
  }

  export abstract class RoutesComponent extends HyperdomComponent {
    public abstract routes (): router.Route[]

    protected renderLayout (content: any): VdomFragment | Component
  }

  export type Component = RoutesComponent | RenderComponent

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

  export type SimpleBinding = [object, string] | [object, string, (param: string | number) => any]

  export type Binding = ObjectBinding | SimpleBinding

  export type FnComponent = (model?: any) => VdomFragment

  export function append (root: HTMLElement, component: Component | FnComponent, opts?: MountOpts): DomAttachement

  export function replace (root: HTMLElement, component: Component | FnComponent, opts?: MountOpts): DomAttachement

  interface ModelMeta {
    error: {
      message: string,
    }
  }

  export interface HtmlNodeProps {
    [key: string]: string | number | object | boolean | undefined | null
  }

  export interface HyperdomNodeProps {
    binding?: Binding

    key?: string | number

    onclick? (): void
  }

  export type NodeProps = HtmlNodeProps & HyperdomNodeProps

  // TODO Date?
  export type Renderable = string | number | boolean | undefined | null | VdomFragment | Component

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

  export function viewComponent (component: Component): VdomFragment

  export function appendVDom (root: VdomFragment, component: Component | FnComponent): DomAttachement

  const jsx: (
    tag: string | { new<T extends object>(props: T, children: Renderable[]): Component },
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
      // HTML & hyperdom.HyperdomNodeProps
      a: Partial<HTMLAnchorElement> & hyperdom.HyperdomNodeProps
      abbr: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      address: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      area: Partial<HTMLAreaElement> & hyperdom.HyperdomNodeProps
      article: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      aside: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      audio: Partial<HTMLAudioElement> & hyperdom.HyperdomNodeProps
      b: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      base: Partial<HTMLBaseElement> & hyperdom.HyperdomNodeProps
      bdi: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      bdo: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      big: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      blockquote: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      body: Partial<HTMLBodyElement> & hyperdom.HyperdomNodeProps
      br: Partial<HTMLBRElement> & hyperdom.HyperdomNodeProps
      button: Partial<HTMLButtonElement> & hyperdom.HyperdomNodeProps
      canvas: Partial<HTMLCanvasElement> & hyperdom.HyperdomNodeProps
      caption: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      cite: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      code: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      col: Partial<HTMLTableColElement> & hyperdom.HyperdomNodeProps
      colgroup: Partial<HTMLTableColElement> & hyperdom.HyperdomNodeProps
      data: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      datalist: Partial<HTMLDataListElement> & hyperdom.HyperdomNodeProps
      dd: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      del: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      details: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      dfn: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      dialog: Partial<HTMLDialogElement> & hyperdom.HyperdomNodeProps
      div: Partial<HTMLDivElement> & hyperdom.HyperdomNodeProps
      dl: Partial<HTMLDListElement> & hyperdom.HyperdomNodeProps
      dt: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      em: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      embed: Partial<HTMLEmbedElement> & hyperdom.HyperdomNodeProps
      fieldset: Partial<HTMLFieldSetElement> & hyperdom.HyperdomNodeProps
      figcaption: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      figure: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      footer: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      form: Partial<HTMLFormElement> & hyperdom.HyperdomNodeProps
      h1: Partial<HTMLHeadingElement> & hyperdom.HyperdomNodeProps
      h2: Partial<HTMLHeadingElement> & hyperdom.HyperdomNodeProps
      h3: Partial<HTMLHeadingElement> & hyperdom.HyperdomNodeProps
      h4: Partial<HTMLHeadingElement> & hyperdom.HyperdomNodeProps
      h5: Partial<HTMLHeadingElement> & hyperdom.HyperdomNodeProps
      h6: Partial<HTMLHeadingElement> & hyperdom.HyperdomNodeProps
      head: Partial<HTMLHeadElement> & hyperdom.HyperdomNodeProps
      header: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      hgroup: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      hr: Partial<HTMLHRElement> & hyperdom.HyperdomNodeProps
      html: Partial<HTMLHtmlElement> & hyperdom.HyperdomNodeProps
      i: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      iframe: Partial<HTMLIFrameElement> & hyperdom.HyperdomNodeProps
      img: Partial<HTMLImageElement> & hyperdom.HyperdomNodeProps
      input: Partial<HTMLInputElement> & hyperdom.HyperdomNodeProps
      ins: Partial<HTMLModElement> & hyperdom.HyperdomNodeProps
      kbd: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      keygen: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      label: Partial<HTMLLabelElement> & hyperdom.HyperdomNodeProps
      legend: Partial<HTMLLegendElement> & hyperdom.HyperdomNodeProps
      li: Partial<HTMLLIElement> & hyperdom.HyperdomNodeProps
      link: Partial<HTMLLinkElement> & hyperdom.HyperdomNodeProps
      main: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      map: Partial<HTMLMapElement> & hyperdom.HyperdomNodeProps
      mark: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      menu: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      menuitem: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      meta: Partial<HTMLMetaElement> & hyperdom.HyperdomNodeProps
      meter: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      nav: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      noindex: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      noscript: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      object: Partial<HTMLObjectElement> & hyperdom.HyperdomNodeProps
      ol: Partial<HTMLOListElement> & hyperdom.HyperdomNodeProps
      optgroup: Partial<HTMLOptGroupElement> & hyperdom.HyperdomNodeProps
      option: Partial<HTMLOptionElement> & hyperdom.HyperdomNodeProps
      output: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      p: Partial<HTMLParagraphElement> & hyperdom.HyperdomNodeProps
      param: Partial<HTMLParamElement> & hyperdom.HyperdomNodeProps
      picture: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      pre: Partial<HTMLPreElement> & hyperdom.HyperdomNodeProps
      progress: Partial<HTMLProgressElement> & hyperdom.HyperdomNodeProps
      q: Partial<HTMLQuoteElement> & hyperdom.HyperdomNodeProps
      rp: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      rt: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      ruby: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      s: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      samp: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      script: Partial<HTMLScriptElement> & hyperdom.HyperdomNodeProps
      section: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      select: Partial<HTMLSelectElement> & hyperdom.HyperdomNodeProps
      small: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      source: Partial<HTMLSourceElement> & hyperdom.HyperdomNodeProps
      span: Partial<HTMLSpanElement> & hyperdom.HyperdomNodeProps
      strong: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      style: Partial<HTMLStyleElement> & hyperdom.HyperdomNodeProps
      sub: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      summary: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      sup: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      table: Partial<HTMLTableElement> & hyperdom.HyperdomNodeProps
      tbody: Partial<HTMLTableSectionElement> & hyperdom.HyperdomNodeProps
      td: Partial<HTMLTableDataCellElement> & hyperdom.HyperdomNodeProps
      textarea: Partial<HTMLTextAreaElement> & hyperdom.HyperdomNodeProps
      tfoot: Partial<HTMLTableSectionElement> & hyperdom.HyperdomNodeProps
      th: Partial<HTMLTableHeaderCellElement> & hyperdom.HyperdomNodeProps
      thead: Partial<HTMLTableSectionElement> & hyperdom.HyperdomNodeProps
      time: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      title: Partial<HTMLTitleElement> & hyperdom.HyperdomNodeProps
      tr: Partial<HTMLTableRowElement> & hyperdom.HyperdomNodeProps
      track: Partial<HTMLTrackElement> & hyperdom.HyperdomNodeProps
      u: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      ul: Partial<HTMLUListElement> & hyperdom.HyperdomNodeProps
      "var": Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      video: Partial<HTMLVideoElement> & hyperdom.HyperdomNodeProps
      wbr: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
      webview: Partial<HTMLElement> & hyperdom.HyperdomNodeProps
 & hyperdom.HyperdomNodeProps
      // SVG
      svg: Partial<SVGSVGElement> & hyperdom.HyperdomNodeProps
 & hyperdom.HyperdomNodeProps
      animate: Partial<SVGElement> & hyperdom.HyperdomNodeProps
      animateTransform: Partial<SVGElement> & hyperdom.HyperdomNodeProps
      circle: Partial<SVGCircleElement> & hyperdom.HyperdomNodeProps
      clipPath: Partial<SVGClipPathElement> & hyperdom.HyperdomNodeProps
      defs: Partial<SVGDefsElement> & hyperdom.HyperdomNodeProps
      desc: Partial<SVGDescElement> & hyperdom.HyperdomNodeProps
      ellipse: Partial<SVGEllipseElement> & hyperdom.HyperdomNodeProps
      feBlend: Partial<SVGFEBlendElement> & hyperdom.HyperdomNodeProps
      feColorMatrix: Partial<SVGFEColorMatrixElement> & hyperdom.HyperdomNodeProps
      feComponentTransfer: Partial<SVGFEComponentTransferElement> & hyperdom.HyperdomNodeProps
      feComposite: Partial<SVGFECompositeElement> & hyperdom.HyperdomNodeProps
      feConvolveMatrix: Partial<SVGFEConvolveMatrixElement> & hyperdom.HyperdomNodeProps
      feDiffuseLighting: Partial<SVGFEDiffuseLightingElement> & hyperdom.HyperdomNodeProps
      feDisplacementMap: Partial<SVGFEDisplacementMapElement> & hyperdom.HyperdomNodeProps
      feDistantLight: Partial<SVGFEDistantLightElement> & hyperdom.HyperdomNodeProps
      feFlood: Partial<SVGFEFloodElement> & hyperdom.HyperdomNodeProps
      feFuncA: Partial<SVGFEFuncAElement> & hyperdom.HyperdomNodeProps
      feFuncB: Partial<SVGFEFuncBElement> & hyperdom.HyperdomNodeProps
      feFuncG: Partial<SVGFEFuncGElement> & hyperdom.HyperdomNodeProps
      feFuncR: Partial<SVGFEFuncRElement> & hyperdom.HyperdomNodeProps
      feGaussianBlur: Partial<SVGFEGaussianBlurElement> & hyperdom.HyperdomNodeProps
      feImage: Partial<SVGFEImageElement> & hyperdom.HyperdomNodeProps
      feMerge: Partial<SVGFEMergeElement> & hyperdom.HyperdomNodeProps
      feMergeNode: Partial<SVGFEMergeNodeElement> & hyperdom.HyperdomNodeProps
      feMorphology: Partial<SVGFEMorphologyElement> & hyperdom.HyperdomNodeProps
      feOffset: Partial<SVGFEOffsetElement> & hyperdom.HyperdomNodeProps
      fePointLight: Partial<SVGFEPointLightElement> & hyperdom.HyperdomNodeProps
      feSpecularLighting: Partial<SVGFESpecularLightingElement> & hyperdom.HyperdomNodeProps
      feSpotLight: Partial<SVGFESpotLightElement> & hyperdom.HyperdomNodeProps
      feTile: Partial<SVGFETileElement> & hyperdom.HyperdomNodeProps
      feTurbulence: Partial<SVGFETurbulenceElement> & hyperdom.HyperdomNodeProps
      filter: Partial<SVGFilterElement> & hyperdom.HyperdomNodeProps
      foreignObject: Partial<SVGForeignObjectElement> & hyperdom.HyperdomNodeProps
      g: Partial<SVGGElement> & hyperdom.HyperdomNodeProps
      image: Partial<SVGImageElement> & hyperdom.HyperdomNodeProps
      line: Partial<SVGLineElement> & hyperdom.HyperdomNodeProps
      linearGradient: Partial<SVGLinearGradientElement> & hyperdom.HyperdomNodeProps
      marker: Partial<SVGMarkerElement> & hyperdom.HyperdomNodeProps
      mask: Partial<SVGMaskElement> & hyperdom.HyperdomNodeProps
      metadata: Partial<SVGMetadataElement> & hyperdom.HyperdomNodeProps
      path: Partial<SVGPathElement> & hyperdom.HyperdomNodeProps
      pattern: Partial<SVGPatternElement> & hyperdom.HyperdomNodeProps
      polygon: Partial<SVGPolygonElement> & hyperdom.HyperdomNodeProps
      polyline: Partial<SVGPolylineElement> & hyperdom.HyperdomNodeProps
      radialGradient: Partial<SVGRadialGradientElement> & hyperdom.HyperdomNodeProps
      rect: Partial<SVGRectElement> & hyperdom.HyperdomNodeProps
      stop: Partial<SVGStopElement> & hyperdom.HyperdomNodeProps
      switch: Partial<SVGSwitchElement> & hyperdom.HyperdomNodeProps
      symbol: Partial<SVGSymbolElement> & hyperdom.HyperdomNodeProps
      text: Partial<SVGTextElement> & hyperdom.HyperdomNodeProps
      textPath: Partial<SVGTextPathElement> & hyperdom.HyperdomNodeProps
      tspan: Partial<SVGTSpanElement> & hyperdom.HyperdomNodeProps
      use: Partial<SVGUseElement> & hyperdom.HyperdomNodeProps
      view: Partial<SVGViewElement> & hyperdom.HyperdomNodeProps
    }
  }
}
