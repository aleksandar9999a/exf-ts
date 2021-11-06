export interface Provider {
  type?: 'singleton'|'multiton',
  value: any
}

export interface Providers {
  [key: string]: Provider
}
