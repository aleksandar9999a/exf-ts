import { DOM, Element, ComponentFunction } from './'
import { ObjectAny } from './interfaces'

export function createComponent (tag: string, fn: ComponentFunction, deps?: ObjectAny) {
  class BindedElement extends Element {
    static elementName = tag

    constructor (dom = new DOM(document)) {
      super(dom, fn, deps)
    }
  }

  customElements.define(tag, BindedElement)
  return BindedElement
}

