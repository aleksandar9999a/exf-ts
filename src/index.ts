import { createHTMLSource } from "./packages/ex-html";
import ITag from "./packages/ex-html/interfaces/ITagEvent";

const rootTemplate = (context: any) => createHTMLSource`
<div><button @click=${() => context.counter++}>test</button><p>${context.counter}</p></div>
`;

function state(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) {
    if (!!descriptor) {
        const currentMethod = descriptor.value;
        descriptor.value = function (this: any, ...args: any[]) {
            currentMethod(...args);
            if (this.update) { this.update(); }
        }
        return;
    }

    let val: any;

    Object.defineProperty(target, key, {
        set(newValue) {
            val = newValue;
            if (this.update) { this.update(); }
        },
        get() {
            return val;
        }
    });
}

class AppRoot extends HTMLElement {
    root: ShadowRoot;
    @state counter = 0;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.update();
    }

    update() {
        if (!this.root) { return; }
        this.root.innerHTML = "";
        const source = rootTemplate(this);
        this.render(source.template);
        this.attachEvents(source.events);
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