import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { updateTemplate, compileRealDom, addActions } from '../html';

export function Component({ selector, template }: { selector: string, template: string }) {
    return function componentDecorator(target: any) {
        class BasicComponent extends HTMLElement {
            root: ShadowRoot;
            stringTemplate: string;
            realDom: HTMLTemplateElement;

            constructor() {
                super();
                target.call(this);
                this.stringTemplate = template;
                this.root = this.attachShadow({ mode: "closed" });
                this.realDom = compileRealDom(this, template);
                this.root.appendChild(
                    this.realDom.content.cloneNode(true)
                );
                addActions(this);
            }

            updateProp() {
                if (!this.root) { return; }
                updateTemplate(this);
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
    }
}