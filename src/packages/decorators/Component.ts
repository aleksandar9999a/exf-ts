import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { replaceProps, addActions } from '../html';


export function Component({ selector, template }: { selector: string, template: string }) {
    return function componentDecorator(target: any) {
        class BasicComponent extends HTMLElement {
            root: ShadowRoot;

            constructor() {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: "closed" });
                this.update();
            }

            update() {
                if (!this.root) { return; }
                this.root.innerHTML = "";
                const html = replaceProps(template, this);
                this.root.appendChild(
                    html.content.cloneNode(true)
                );
                addActions.bind(this)(this.root.querySelectorAll('*'), this)
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
    }
}