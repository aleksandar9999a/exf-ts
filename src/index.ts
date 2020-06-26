import { createHTMLSource } from "./packages/ex-html";
import ITag from "./packages/ex-html/interfaces/ITagEvent";

const rootTemplate = (context: any) => createHTMLSource`
<div><button @click=${() => context.counter++}>test</button><p>${context.counter}</p></div>
`;

class AppRoot extends HTMLElement {
    root: ShadowRoot;
    _counter: number = 0;

    set counter(value: any) {
        this._counter = value;
        this.update();
    }

    get counter() {
        return this._counter;
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.update();
    }

    update() {
        this.root.innerHTML = "";
        const source = rootTemplate(this);
        this.render(source.template);
        this.attachEvents(source.events)
    }

    render(template: HTMLTemplateElement) {
        this.root.appendChild(
            template.content.cloneNode(true)
        );
    }

    attachEvents(events: ITag[]) {
        events.forEach(event => {
            const el = this.root.getElementById(event.id);
            if (el) {
                el.addEventListener(event.name, event.value)
            }
        })
    }
}

customElements.define("hg-app", AppRoot);