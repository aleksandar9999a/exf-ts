import { IComponentDecorator, IHTMLRepresentation, IVirtualDomBuilder, IWorkLoop, IElementChange } from '../interfaces/interfaces';
import { Inject } from './Injectable';

export function Component({ selector, template }: { selector: string, template: string }): any {
    return function componentDecorator(target: any) {
        const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];


        class BasicComponent extends HTMLElement implements IComponentDecorator {
            @Inject('VirtualDomBuilder') private vDomBuilder!: IVirtualDomBuilder;
            @Inject('WorkLoop') private workLoop!: IWorkLoop;
            root: ShadowRoot;
            currRepresentation: IHTMLRepresentation[];
            lastChanges: IElementChange[] = [];
            virtualDom: IHTMLRepresentation[];
            realDom: HTMLElement | HTMLTemplateElement;

            static get observedAttributes() {
                return attributes;
            }

            attributeChangedCallback(name: any, oldValue: any, newValue: any) {
                (this as any)[name] = newValue;
            }

            constructor() {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: 'closed' })
                this.virtualDom = this.vDomBuilder.createVirtualDom(template);
                this.currRepresentation = this.vDomBuilder.createState(this.virtualDom, this);
                this.realDom = this.vDomBuilder.createRealDom(this.currRepresentation, this);
                this.root.appendChild(this.realDom);
            }

            update() {
                this.workLoop.pushWork(() => {
                    const { newState, changes } = this.vDomBuilder.update(this, this.virtualDom, this.currRepresentation);
                    this.currRepresentation = newState;
                    this.lastChanges = changes;
                    return this.updateView.bind(this);
                })
            }

            updateView() {
                this.vDomBuilder.updateHTML(this.root.children[0].children, this.lastChanges);
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
        target.selector = selector;
        return BasicComponent;
    }
}