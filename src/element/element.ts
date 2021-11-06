import { State, observe } from '../observe'
import { DOM, Template, ComponentFunction } from './'
import { ObjectAny } from './interfaces'

export class Element extends HTMLElement {
  private render!: () => Template
  private template: Template = []
  private mountSubs: (() => any)[] = []
  private unmountSubs: (() => any)[] = []
  private errorSubs: ((err: Error) => any)[] = [Element.onError]
  private shadow: ShadowRoot|null = null

  uuid = Element.uuidFactory()
  props: { [key:string]: State<any> } = {}
  state: { [key:string]: State<any> } = {}
  shadowMode: null|'closed'|'open' = null
  isCreated = false

  static _global: { [key: string]: any, style: string } = {
    style: ''
  }

  static get global () { return Element._global }

  static set global (value) {
    Element._global = value
  }

  static _onError: (err: Error) => any = (err) => {
    console.error(err)
  }

  static get onError () {
    return Element._onError
  }

  static set onError (value: (err: Error) => any) {
    Element._onError = value
  }

  static get stateFactory () {
    return observe
  }

  static uuidFactory = () => {
    return (([1e7] as any)+-(1e3 as any)+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  get global () {
    return Element.global
  }

  constructor (
    private grid: DOM,
    private element: ComponentFunction,
    private dep?: ObjectAny
  ) { super() }

  private getKey (key?: string) {
    if (key) {
      return key
    }

    return Element.uuidFactory()
  }

  observe <T>(value: T, key?: string) {
    const state = Element.stateFactory(value)

    state.watch(() => {
      if (!this.isCreated) {
        return
      }

      this.rerender()
    })

    this.state[this.getKey(key)] = state

    return state
  }

  onError (fn: () => any) {
    this.errorSubs.push(fn)
  }

  onMount (fn: () => any) {
    this.mountSubs.push(fn)
  }

  onUnmount (fn: () => any) {
    this.unmountSubs.push(fn)
  }

  setAttribute <T>(key: string, value: T) {
    if (!this.props[key]) {
      this.props[key] = Element.stateFactory(value)

      this.props[key].watch(() => {
        if (!this.isCreated) {
          return
        }
  
        this.rerender()
      })
    } else if (this.props[key].value !== value) {
      this.props[key].value = value
    }

    return this.props[key]
  }

  private createShadow () {
    this.shadow = this.attachShadow({ mode: this.shadowMode as 'open'|'closed' })
    return this.shadow
  }

  private getParent () {
    if (this.shadowMode) {
      return this.shadow || this.createShadow()
    }

    return this
  }

  private rerender () {
    if (!this.render) {
      return Promise.resolve([] as Template)
    }

    return Promise.resolve()
      .then(() => {
        return this.render()
      })
      .then(template => {
        return this.grid.build(this.getParent(), this.template, template)
      })
      .then(template => {
        this.template = template
        return this.template
      })
      .catch(err => {
        this.errorSubs.forEach(sub => sub(err))
      })
  }

  /**
   * Reassign props to can force run pipes before render
   */
  private rerunPropsPipes () {
    Object.values(this.props).forEach(prop => {
      if (prop.pipes.length > 0) {
        prop.value = prop.value
      }
    })
  }

  connectedCallback () {
    return Promise.resolve()
      .then(() => {
        const module = this.element(this, this.dep || {})

        if (module instanceof Promise) {
          return module.then(m => m.default || m).then(element => element(this, this.dep || {}))
        }

        return module
      })
      .then(render => {
        this.rerunPropsPipes()
        this.render = render
        return this.rerender()
      })
      .then(() => {
        this.isCreated = true
        this.mountSubs.forEach(sub => sub())
      })
  }

  disconnectedCallback () {
    this.unmountSubs.forEach(sub => sub())
  }
}
