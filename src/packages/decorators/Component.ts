import ITag from "../ex-html/interfaces/ITagEvent";
import ITemplateResult from "../ex-html/interfaces/ITemplateResult";
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';

interface IComponent {
    root: ShadowRoot,
    update: () => void;
    render: (template: HTMLTemplateElement) => void;
    attachEvents: (events: ITag[]) => void;
}

export function Component<T>({ selector, templateFn }: { selector: string, templateFn: (context: T) => ITemplateResult }) {
    return function componentDecorator(target: any) {
        class BasicComponent extends HTMLElement implements IComponent {
            root: ShadowRoot;

            constructor() {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: "closed" });
                this.update();
            }

            update() {
                if (!this.root) { return; }
                const source = templateFn(this as any);
                this.render(source.template);
                this.attachEvents(source.events);
            }

            render(template: HTMLTemplateElement) {
                this.root.innerHTML = "";
                this.root.appendChild(
                    template.content.cloneNode(true)
                );
            }

            attachEvents(events: ITag[]) {
                events.forEach(event => {
                    const el = this.root.getElementById(event.id);
                    if (el) {
                        el.addEventListener(event.name, event.value.bind(this))
                    }
                })
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
    }
}