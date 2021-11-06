import { ObjectAny } from '../element/interfaces'
import { Provider, Providers } from './interfaces'

function isClass(v: any) {
  return typeof v === 'function' && /^\s*class\s+/.test(v.toString())
}

function resolve (key: string, provider: Provider, providerMap: ObjectAny) {
  return Promise.resolve()
    .then(() => {
      if (isClass(provider.value)) {
        return provider.value
      }

      return (typeof provider.value === 'function' && provider.value()) || provider.value
    })
    .then(service => {
      if (!isClass(service)) {
        return service
      }

      if (provider.type === 'singleton' && providerMap[key]) {
        return providerMap[key]
      }

      const value = new service()

      if (provider.type === 'singleton') {
        providerMap[key] = value
      }

      return value
    })
}

export function depFactory <Dep>(deps: Providers) {
  const values: ObjectAny = {}

  return Object.entries(deps).reduce((acc: any, [key, service]) => {
    acc[key] = resolve.bind(undefined, key, service, values)
    return acc
  }, {}) as { [key in keyof Dep]: Dep[key] }
}
