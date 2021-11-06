import { Element } from './'

export interface ObjectAny {
  [key: string]: any
}

export interface TemplateElement {
	tag: string,
  props: ObjectAny,
  children: Template,
  element?: HTMLElement|Text
}

export type Template = TemplateElement[]
 
export type ComponentInitFunction = (element: Element, dep?: ObjectAny) => () => Template|JSX.Element
export type ComponentPromiseFunction = ((element: Element, dep?: ObjectAny) => () => Promise<Template>|Template)
export type ComponentPromiseInitFunction = () => Promise<any>
export type ComponentFunction = ComponentInitFunction|ComponentPromiseInitFunction|ComponentPromiseFunction
