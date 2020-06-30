import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { IComponentDecorator, IHTMLRepresentation, IVirtualDomBuilder } from '../interfaces/interfaces';
import { Inject } from './Injectable';

export function Component({ selector, template }: { selector: string, template: string }): ClassDecorator {
    return function componentDecorator(target: any) {
        const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];

        class BasicComponent extends HTMLElement implements IComponentDecorator{
            @Inject('VirtualDomBuilder') private vDomBuilder!: IVirtualDomBuilder;
            root: ShadowRoot;
            currRepresentation: IHTMLRepresentation[];
            virtualDom: IHTMLRepresentation[];
            realDom: HTMLElement;
            
            static get observedAttributes() {
                return attributes;
            }

            attributeChangedCallback(name: any, oldValue: any, newValue: any) {
                (this as any)[name] = newValue;
            }

            constructor( ) {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: "closed" });
                this.virtualDom = this.vDomBuilder.createVirtualDom(template);
                this.currRepresentation = this.vDomBuilder.createState(this.virtualDom, this);
                this.realDom = this.vDomBuilder.createRealDom(this.currRepresentation, this);
                this.root.appendChild(this.realDom);
            }

            update() {
                if (!this.root) { return; }
                this.currRepresentation = this.vDomBuilder.update(this, this.virtualDom, this.currRepresentation);
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
    }
}