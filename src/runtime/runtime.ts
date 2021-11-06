import { ObjectAny } from '../element'
import { BindedPlatform, createPlatform, PlatformParams } from '../platform'

export class Runtime {
  platforms: Map<string, BindedPlatform> = new Map<string, BindedPlatform>()

  static platformFactory = createPlatform

  createPlatform (options: PlatformParams) {
    const platform = Runtime.platformFactory(options)

    this.platforms.set(platform.name, platform)

    return platform
  }

  run (params: ObjectAny) {
    this.platforms.forEach(platform => {
      if (typeof platform.conditions === 'function' && platform.conditions(params)) {
        platform.mount()
      } else {
        platform.unmount()
      }
    })
  }
}

export function createRuntime () {
  const runtime = new Runtime()

  return runtime
}