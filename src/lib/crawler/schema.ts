export interface SiteMap {
  [key: string]: Element[],
}

export interface Element {
  tag: string
  attributes: Attribute[]
  value: string
}

export interface Attribute {
  key: string
  value: string|number|boolean
}
