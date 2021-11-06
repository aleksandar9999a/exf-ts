import { ObjectAny } from '../element'

function createStateProxy (target: ObjectAny, onUpdate: () => any) {
  const handler = {
    set: (target: ObjectAny, key: string, value: any) => {
      const oldValue = target[key]
      target[key] = value

      if (oldValue !== target.value) {
        onUpdate()
      }

      return true
    },
    get: (target: ObjectAny, key: string) => {
      return target[key]
    }
  }

  const proxy = new Proxy(target, handler)

  Object.entries(proxy).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      proxy[key] = createStateProxy(value, onUpdate)
    }
  })

  return proxy
}

export class State<T> {
  readonly isState = true

  watchers: ((value: T, oldValue: T) => any)[] = []
  pipes: ((value: T, oldValue: T) => any)[] = []
  oldValue: T

  get value () {
    return this._value
  }

  set value (value: T) {
    this.oldValue = this._value
    this._value = this.runPipes(value)
  }

  constructor (private _value: T) {
    this.oldValue = _value
    this.runWatchers = this.runWatchers.bind(this)
  }

  private runPipes (value: T) {
    return this.pipes.reduce((acc, pipe) => {
      return pipe(acc, this.value)
    }, value)
  }

  runWatchers () {
    this.watchers.forEach(watch => {
      watch(this.value, this.oldValue)
    })
  }

  watch (fn: (value: T, oldValue: T) => any) {
    this.watchers.push(fn)
  }

  pipe (fn: (value: T, oldValue: T) => any) {
    this.pipes.push(fn)
    return this
  }
}

export function observe <T>(value: T) {
  const target = new State(value)

  return createStateProxy(target, target.runWatchers) as State<T>
}
