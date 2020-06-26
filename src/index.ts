import { createHTMLSource } from "./packages/ex-html";
import ITag from "./packages/ex-html/interfaces/ITagEvent";

class App extends HTMLElement {
    attachEvents(root: ShadowRoot, events: ITag[]) {
        events.forEach(event => {
            const el = root.getElementById(event.id);
            if(el) {
                el.addEventListener(event.name, event.value)
            }
        })
    }
    
    constructor() {
        super();
        const root = this.attachShadow({ mode: "closed" });
        const source = createHTMLSource`<div><button @click=${() => console.log('It Work!')}>test</button><p>raboti</p></div>`;

        root.appendChild(
            source.template.content.cloneNode(true)
        );

        this.attachEvents(root, source.events);
    }
}

customElements.define("hg-app", App);