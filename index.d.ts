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
    get (): string
    set (value: string): void
  }

  export type SimpleBinding = [object, string] | [object, string, (param: string) => any]

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

    onclick? (e?: Event): void
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
    interface WebViewHTMLAttributes extends HTMLElement {
      allowFullScreen?: boolean
      allowpopups?: boolean
      autoFocus?: boolean
      autosize?: boolean
      blinkfeatures?: string
      disableblinkfeatures?: string
      disableguestresize?: boolean
      disablewebsecurity?: boolean
      guestinstance?: string
      httpreferrer?: string
      nodeintegration?: boolean
      partition?: string
      plugins?: boolean
      preload?: string
      src?: string
      useragent?: string
      webpreferences?: string
    }

    interface SVGAttributes {
      // Attributes which also defined in HTMLAttributes
      // See comment in SVGDOMPropertyConfig.js
      className?: string
      color?: string
      height?: number | string
      id?: string
      lang?: string
      max?: number | string
      media?: string
      method?: string
      min?: number | string
      name?: string
      target?: string
      type?: string
      width?: number | string

      // Other HTML properties supported by SVG elements in browsers
      role?: string
      tabIndex?: number

      // SVG Specific attributes
      accentHeight?: number | string
      accumulate?: "none" | "sum"
      additive?: "replace" | "sum"
      alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" |
        "middle" | "central" | "after-edge" |
        "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit"
      allowReorder?: "no" | "yes"
      alphabetic?: number | string
      amplitude?: number | string
      arabicForm?: "initial" | "medial" | "terminal" | "isolated"
      ascent?: number | string
      attributeName?: string
      attributeType?: string
      autoReverse?: number | string
      azimuth?: number | string
      baseFrequency?: number | string
      baselineShift?: number | string
      baseProfile?: number | string
      bbox?: number | string
      begin?: number | string
      bias?: number | string
      by?: number | string
      calcMode?: number | string
      capHeight?: number | string
      clip?: number | string
      clipPath?: string
      clipPathUnits?: number | string
      clipRule?: number | string
      colorInterpolation?: number | string
      colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit"
      colorProfile?: number | string
      colorRendering?: number | string
      contentScriptType?: number | string
      contentStyleType?: number | string
      cursor?: number | string
      cx?: number | string
      cy?: number | string
      d?: string
      decelerate?: number | string
      descent?: number | string
      diffuseConstant?: number | string
      direction?: number | string
      display?: number | string
      divisor?: number | string
      dominantBaseline?: number | string
      dur?: number | string
      dx?: number | string
      dy?: number | string
      edgeMode?: number | string
      elevation?: number | string
      enableBackground?: number | string
      end?: number | string
      exponent?: number | string
      externalResourcesRequired?: number | string
      fill?: string
      fillOpacity?: number | string
      fillRule?: "nonzero" | "evenodd" | "inherit"
      filter?: string
      filterRes?: number | string
      filterUnits?: number | string
      floodColor?: number | string
      floodOpacity?: number | string
      focusable?: number | string
      fontFamily?: string
      fontSize?: number | string
      fontSizeAdjust?: number | string
      fontStretch?: number | string
      fontStyle?: number | string
      fontVariant?: number | string
      fontWeight?: number | string
      format?: number | string
      from?: number | string
      fx?: number | string
      fy?: number | string
      g1?: number | string
      g2?: number | string
      glyphName?: number | string
      glyphOrientationHorizontal?: number | string
      glyphOrientationVertical?: number | string
      glyphRef?: number | string
      gradientTransform?: string
      gradientUnits?: string
      hanging?: number | string
      horizAdvX?: number | string
      horizOriginX?: number | string
      href?: string
      ideographic?: number | string
      imageRendering?: number | string
      in2?: number | string
      in?: string
      intercept?: number | string
      k1?: number | string
      k2?: number | string
      k3?: number | string
      k4?: number | string
      k?: number | string
      kernelMatrix?: number | string
      kernelUnitLength?: number | string
      kerning?: number | string
      keyPoints?: number | string
      keySplines?: number | string
      keyTimes?: number | string
      lengthAdjust?: number | string
      letterSpacing?: number | string
      lightingColor?: number | string
      limitingConeAngle?: number | string
      local?: number | string
      markerEnd?: string
      markerHeight?: number | string
      markerMid?: string
      markerStart?: string
      markerUnits?: number | string
      markerWidth?: number | string
      mask?: string
      maskContentUnits?: number | string
      maskUnits?: number | string
      mathematical?: number | string
      mode?: number | string
      numOctaves?: number | string
      offset?: number | string
      opacity?: number | string
      operator?: number | string
      order?: number | string
      orient?: number | string
      orientation?: number | string
      origin?: number | string
      overflow?: number | string
      overlinePosition?: number | string
      overlineThickness?: number | string
      paintOrder?: number | string
      panose1?: number | string
      pathLength?: number | string
      patternContentUnits?: string
      patternTransform?: number | string
      patternUnits?: string
      pointerEvents?: number | string
      points?: string
      pointsAtX?: number | string
      pointsAtY?: number | string
      pointsAtZ?: number | string
      preserveAlpha?: number | string
      preserveAspectRatio?: string
      primitiveUnits?: number | string
      r?: number | string
      radius?: number | string
      refX?: number | string
      refY?: number | string
      renderingIntent?: number | string
      repeatCount?: number | string
      repeatDur?: number | string
      requiredExtensions?: number | string
      requiredFeatures?: number | string
      restart?: number | string
      result?: string
      rotate?: number | string
      rx?: number | string
      ry?: number | string
      scale?: number | string
      seed?: number | string
      shapeRendering?: number | string
      slope?: number | string
      spacing?: number | string
      specularConstant?: number | string
      specularExponent?: number | string
      speed?: number | string
      spreadMethod?: string
      startOffset?: number | string
      stdDeviation?: number | string
      stemh?: number | string
      stemv?: number | string
      stitchTiles?: number | string
      stopColor?: string
      stopOpacity?: number | string
      strikethroughPosition?: number | string
      strikethroughThickness?: number | string
      string?: number | string
      stroke?: string
      strokeDasharray?: string | number
      strokeDashoffset?: string | number
      strokeLinecap?: "butt" | "round" | "square" | "inherit"
      strokeLinejoin?: "miter" | "round" | "bevel" | "inherit"
      strokeMiterlimit?: number | string
      strokeOpacity?: number | string
      strokeWidth?: number | string
      surfaceScale?: number | string
      systemLanguage?: number | string
      tableValues?: number | string
      targetX?: number | string
      targetY?: number | string
      textAnchor?: string
      textDecoration?: number | string
      textLength?: number | string
      textRendering?: number | string
      to?: number | string
      transform?: string
      u1?: number | string
      u2?: number | string
      underlinePosition?: number | string
      underlineThickness?: number | string
      unicode?: number | string
      unicodeBidi?: number | string
      unicodeRange?: number | string
      unitsPerEm?: number | string
      vAlphabetic?: number | string
      values?: string
      vectorEffect?: number | string
      version?: string
      vertAdvY?: number | string
      vertOriginX?: number | string
      vertOriginY?: number | string
      vHanging?: number | string
      vIdeographic?: number | string
      viewBox?: string
      viewTarget?: number | string
      visibility?: number | string
      vMathematical?: number | string
      widths?: number | string
      wordSpacing?: number | string
      writingMode?: number | string
      x1?: number | string
      x2?: number | string
      x?: number | string
      xChannelSelector?: string
      xHeight?: number | string
      xlinkActuate?: string
      xlinkArcrole?: string
      xlinkHref?: string
      xlinkRole?: string
      xlinkShow?: string
      xlinkTitle?: string
      xlinkType?: string
      xmlBase?: string
      xmlLang?: string
      xmlns?: string
      xmlnsXlink?: string
      xmlSpace?: string
      y1?: number | string
      y2?: number | string
      y?: number | string
      yChannelSelector?: string
      z?: number | string
      zoomAndPan?: string
    }

    type HyperdomSVGAttributes<T> = SVGAttributes & Exclude<SVGAttributes, T> & hyperdom.HyperdomNodeProps

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
      webview: Partial<WebViewHTMLAttributes> & hyperdom.HyperdomNodeProps
      // SVG
      svg: HyperdomSVGAttributes<SVGSVGElement>
      animate: HyperdomSVGAttributes<SVGElement>
      animateTransform: HyperdomSVGAttributes<SVGElement>
      circle: HyperdomSVGAttributes<SVGCircleElement>
      clipPath: HyperdomSVGAttributes<SVGClipPathElement>
      defs: HyperdomSVGAttributes<SVGDefsElement>
      desc: HyperdomSVGAttributes<SVGDescElement>
      ellipse: HyperdomSVGAttributes<SVGEllipseElement>
      feBlend: HyperdomSVGAttributes<SVGFEBlendElement>
      feColorMatrix: HyperdomSVGAttributes<SVGFEColorMatrixElement>
      feComponentTransfer: HyperdomSVGAttributes<SVGFEComponentTransferElement>
      feComposite: HyperdomSVGAttributes<SVGFECompositeElement>
      feConvolveMatrix: HyperdomSVGAttributes<SVGFEConvolveMatrixElement>
      feDiffuseLighting: HyperdomSVGAttributes<SVGFEDiffuseLightingElement>
      feDisplacementMap: HyperdomSVGAttributes<SVGFEDisplacementMapElement>
      feDistantLight: HyperdomSVGAttributes<SVGFEDistantLightElement>
      feFlood: HyperdomSVGAttributes<SVGFEFloodElement>
      feFuncA: HyperdomSVGAttributes<SVGFEFuncAElement>
      feFuncB: HyperdomSVGAttributes<SVGFEFuncBElement>
      feFuncG: HyperdomSVGAttributes<SVGFEFuncGElement>
      feFuncR: HyperdomSVGAttributes<SVGFEFuncRElement>
      feGaussianBlur: HyperdomSVGAttributes<SVGFEGaussianBlurElement>
      feImage: HyperdomSVGAttributes<SVGFEImageElement>
      feMerge: HyperdomSVGAttributes<SVGFEMergeElement>
      feMergeNode: HyperdomSVGAttributes<SVGFEMergeNodeElement>
      feMorphology: HyperdomSVGAttributes<SVGFEMorphologyElement>
      feOffset: HyperdomSVGAttributes<SVGFEOffsetElement>
      fePointLight: HyperdomSVGAttributes<SVGFEPointLightElement>
      feSpecularLighting: HyperdomSVGAttributes<SVGFESpecularLightingElement>
      feSpotLight: HyperdomSVGAttributes<SVGFESpotLightElement>
      feTile: HyperdomSVGAttributes<SVGFETileElement>
      feTurbulence: HyperdomSVGAttributes<SVGFETurbulenceElement>
      filter: HyperdomSVGAttributes<SVGFilterElement>
      foreignObject: HyperdomSVGAttributes<SVGForeignObjectElement>
      g: HyperdomSVGAttributes<SVGGElement>
      image: HyperdomSVGAttributes<SVGImageElement>
      line: HyperdomSVGAttributes<SVGLineElement>
      linearGradient: HyperdomSVGAttributes<SVGLinearGradientElement>
      marker: HyperdomSVGAttributes<SVGMarkerElement>
      mask: HyperdomSVGAttributes<SVGMaskElement>
      metadata: HyperdomSVGAttributes<SVGMetadataElement>
      path: HyperdomSVGAttributes<SVGPathElement>
      pattern: HyperdomSVGAttributes<SVGPatternElement>
      polygon: HyperdomSVGAttributes<SVGPolygonElement>
      polyline: HyperdomSVGAttributes<SVGPolylineElement>
      radialGradient: HyperdomSVGAttributes<SVGRadialGradientElement>
      rect: HyperdomSVGAttributes<SVGRectElement>
      stop: HyperdomSVGAttributes<SVGStopElement>
      switch: HyperdomSVGAttributes<SVGSwitchElement>
      symbol: HyperdomSVGAttributes<SVGSymbolElement>
      text: HyperdomSVGAttributes<SVGTextElement>
      textPath: HyperdomSVGAttributes<SVGTextPathElement>
      tspan: HyperdomSVGAttributes<SVGTSpanElement>
      use: HyperdomSVGAttributes<SVGUseElement>
      view: HyperdomSVGAttributes<SVGViewElement>
    }
  }
}
