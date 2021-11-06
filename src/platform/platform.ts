import { depFactory } from '../dependency'
import { ComponentFunction, Element, createComponent, ObjectAny } from '../element'
import { PlatformParams, PlatformBootstrap, PlatformComponent } from './'
import { BindedPlatform } from './interfaces'

export class Platform {
  components: (typeof Element)[] = []
  container?: HTMLElement
  app?: HTMLElement
  style?: HTMLElement
  isMounted = false

  static _onError: (err: Error) => any = (err) => {
    console.error(err)
  }

  static get onError () {
    return Platform._onError
  }

  static set onError (value: (err: Error) => any) {
    Platform._onError = value
  }

  static _factory: (tag: string, fn: ComponentFunction) => typeof Element

  static get factory () {
    return Platform._factory
  }

  static set factory (value: (tag: string, fn: ComponentFunction) => typeof Element) {
    Platform._factory = value
  }

  constructor (
    private document: Document,
    public name: string,
    public conditions?: (params: ObjectAny) => boolean
  ) {}

  private getName (tag: string) {
    return `${this.name}-${tag}`
  }

  setComponents (components: PlatformComponent[]) {
    this.components = components.map(({ tag, element }) => Platform.factory(this.getName(tag), element))
    return this.components
  }

  private findElementByTag (tag: string) {
    return this.components.find(x => (x as any).elementName === tag)
  }

  mount (data: PlatformBootstrap) {
    if (this.isMounted) {
      return this.app
    }

    this.container = this.document.querySelector(data.container) as HTMLElement|undefined

    if (!this.container) {
      Platform.onError(new Error(`Element with selector ${data.container} is not found!`))
      return null
    }

    const elementName = this.getName(data.element)

    if (!this.findElementByTag(elementName)) {
      Platform.onError(new Error(`Component with tag name ${data.element} is not registered!`))
      return null
    }

    if (this.style) {
      this.style.remove()
    }

    this.style = data.style

    if (this.app) {
      this.app.remove()
    }

    this.app = this.document.createElement(elementName)

    this.container.appendChild(this.app)
    this.isMounted = true
    return this.app
  }

  unmount () {
    if (this.style) {
      this.style.remove()
    }

    if (this.app) {
      this.app.remove()
    }

    this.isMounted = false

    return null
  }
}

export function createPlatform (options: PlatformParams) {
  Platform.factory = (tag: string, fn: ComponentFunction) => {
    return createComponent(tag, fn, depFactory(options.providers)) as any as typeof Element
  }

  if (options.global) {
    Element.global = {
      ...Element.global,
      ...options.global
    }
  }

  if (options.onError) {
    Element.onError = options.onError
    Platform.onError = options.onError
  }

  const platform = new Platform(document, options.name, options.conditions)

  platform.setComponents(options.components)

  const mount = platform.mount.bind(platform)

  platform.mount = () => {
    const style = document.createElement('inline-style')
    style.setAttribute('css', Element.global.style)
    document.head.appendChild(style)

    return mount({ ...options.bootstrap, style })
  }

  return platform as BindedPlatform
}