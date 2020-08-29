import { App } from './App'

const app = new App();

let i = 0
app.dir = i;

setInterval(() => {
    ++i;
    app.dir = i;
    console.log(app.dir)
}, 1000)

document.getElementById('app')?.appendChild(app as any as HTMLElement)
