import { IComponentDecorator, IHTMLRepresentation, IVirtualDomBuilder, IWorkLoop, IElementChange, IStyleItem } from '../interfaces/interfaces';
import { Inject } from './Injectable';
import { createStyles } from '../styles/createStyles';

export function Component({ selector, template, styles }: { selector: string, template: string, styles?: IStyleItem[] }): any {
    return function componentDecorator(target: any) {
        const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];

        class BasicComponent extends HTMLElement implements IComponentDecorator{
            @Inject('VirtualDomBuilder') private vDomBuilder!: IVirtualDomBuilder;
            @Inject('WorkLoop') private workLoop!: IWorkLoop;
            root: ShadowRoot;
            currRepresentation: IHTMLRepresentation[];
            lastChanges: IElementChange[] = [];
            virtualDom: IHTMLRepresentation[];
            realDom: HTMLElement | Text;

            static get observedAttributes() {
                return attributes;
            }

            attributeChangedCallback(name: any, oldValue: any, newValue: any) {
                (this as any)[name] = newValue;
            }

            constructor() {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: 'open' })
                this.virtualDom = this.vDomBuilder.createTemplateRepresentation(template);
                this.currRepresentation = this.vDomBuilder.createState(this.virtualDom, this);    
                this.realDom = this.vDomBuilder.createRealDom(this.currRepresentation, this);

                if (styles) {
                    const s = createStyles(styles);
                    (this.root as any).adoptedStyleSheets = [s];
                }
                
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
                this.vDomBuilder.updateHTML(this.root.childNodes[0], this.root.children[0].childNodes, this.lastChanges, this);
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);

        customElements.define(selector, BasicComponent);
        target.selector = selector;
        return BasicComponent;
    }
}