import { IComponentDecorator, IHTMLRepresentation, IVirtualDomBuilder, IWorkLoop, IElementChange, IStyleItem } from '../interfaces/interfaces';
import { createStyles } from '../styles/createStyles';
import { vDomBuilderFactory, workLoopFactory } from '../factories/factories';

export function Component({ selector, template, styles }: { selector: string, template: string, styles?: IStyleItem[] }): any {
    return function componentDecorator(target: any) {
        const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];

        class BasicComponent extends HTMLElement implements IComponentDecorator {
            private vDomBuilder: IVirtualDomBuilder;
            private workLoop: IWorkLoop;
            root: ShadowRoot;
            currRepresentation: IHTMLRepresentation[];
            htmlRep: IHTMLRepresentation[];
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
                this.root = this.attachShadow({ mode: 'closed' });
                this.vDomBuilder = vDomBuilderFactory();
                this.workLoop = workLoopFactory();
                this.htmlRep = this.vDomBuilder.createTemplateRepresentation(template);
                this.currRepresentation = this.vDomBuilder.createState(this.htmlRep, this);
                this.realDom = this.vDomBuilder.createRealDom(this.currRepresentation, this);

                if (styles) {
                    const s = createStyles(styles);
                    (this.root as any).adoptedStyleSheets = [s];
                }

                this.root.appendChild(this.realDom);
            }

            update() {
                if(!this.workLoop) { return; }
                this.workLoop.pushWork(() => {
                    const { newState, commit } = this.vDomBuilder.update(this, this.htmlRep, this.currRepresentation);
                    this.currRepresentation = newState;
                    return commit;
                })
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);
        Reflect.defineMetadata('component:selector', selector, BasicComponent);
        customElements.define(selector, BasicComponent);
        return BasicComponent;
    }
}