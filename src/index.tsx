import { App } from './App'

const app = new App()

document.getElementById('app')?.appendChild(app as any as HTMLElement)
