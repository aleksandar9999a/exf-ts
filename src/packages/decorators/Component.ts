import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import VirtualDomBuilder from '../html/virtualDomBuilder';
import 'reflect-metadata';
import { IComponentDecorator, IHTMLRepresentation } from '../interfaces/interfaces';

export function Component({ selector, template }: { selector: string, template: string }) {
    return function componentDecorator(target: any) {

        // console.log(Reflect.getMetadata('design:paramtypes', target));
        const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];

        class BasicComponent extends HTMLElement implements IComponentDecorator {
            root: ShadowRoot;
            VirtualDomBuilder = VirtualDomBuilder;
            currRepresentation: IHTMLRepresentation[];
            virtualDom: IHTMLRepresentation[];
            realDom: HTMLElement;

            static get observedAttributes() {
                return attributes;
            }

            attributeChangedCallback(name: any, oldValue: any, newValue: any) {
                (this as any)[name] = newValue;
            }

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