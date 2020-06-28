import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { IHTMLRepresentation } from '../html/interfaces';
import { IComponentDecorator } from './interfaces';
import VirtualDomBuilder from '../html/virtualDomBuilder';

export function Component({ selector, template }: { selector: string, template: string }) {
    return function componentDecorator(target: any) {

        class BasicComponent extends HTMLElement implements IComponentDecorator {
            root: ShadowRoot;
            VirtualDomBuilder = VirtualDomBuilder;
            currRepresentation: IHTMLRepresentation[];
            virtualDom: IHTMLRepresentation[];
            realDom: HTMLElement;

            constructor() {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: "closed" });
                this.virtualDom = VirtualDomBuilder.createVirtualDom(template);
                this.currRepresentation = VirtualDomBuilder.createState(this.virtualDom, this);
                this.realDom = VirtualDomBuilder.createRealDom(this.currRepresentation, this);
                this.root.appendChild(this.realDom);
            }

            update() {
                if (!this.root) { return; }
                this.currRepresentation = VirtualDomBuilder.update(this, this.virtualDom, this.currRepresentation);
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
    }
}