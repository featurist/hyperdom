interface IConversion {
  view (model: any): string

  model (view: string): any
}

type ConversionFn = (view: string) => any

declare const mapBinding: (model: object, property: string, conversion: IConversion | ConversionFn) => any

export = mapBinding
