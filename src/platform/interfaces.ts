import { Providers } from '../dependency';
import { ComponentFunction } from '../element'
import { Platform } from './platform';

export interface PlatformComponent {
  tag: string,
  element: ComponentFunction
}

export interface PlatformProvider {
  key: string,
  value: any,
  type?: 'singleton'
}

export interface PlatformMount {
  element: string,
  container: string
}

export interface PlatformBootstrap extends PlatformMount {
  style: HTMLElement
}

export interface PlatformParams {
  name: string,
  providers: Providers,
  components: PlatformComponent[],
  bootstrap: PlatformMount,
  onError?: (err: Error) => any,
  global?: { [key: string]: any },
  conditions?: (params: { [key: string]: any }) => boolean
}

export interface BindedPlatform extends Platform {
  mount: () => HTMLElement|null
}