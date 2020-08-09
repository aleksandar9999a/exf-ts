import { IWorkLoop, IStyleItem, IElementRepresentation } from '../interfaces/interfaces';
import { createStyles } from '../styles/createStyles';
import { workLoopFactory } from '../factories/factories';
import { representationParser } from '../virualDomBuilder';

export function Component({ selector, styles }: { selector: string, styles?: IStyleItem[] }): any {
    return function componentDecorator(target: any) {
        const attributes = Reflect.getMetadata('component:attributes', target.prototype) || [];

        class BasicComponent extends HTMLElement {
            private workLoop: IWorkLoop;
            root: ShadowRoot;
            representation: IElementRepresentation;
            render: any;

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
                this.workLoop = workLoopFactory();
                this.representation = this.render();
                this.root.appendChild(representationParser(this.representation));
                if (styles) {
                    const s = createStyles(styles);
                    (this.root as any).adoptedStyleSheets = [s];
                }
            }

            // update() {
            //     if (!this.workLoop) { return; }
            //     this.workLoop.pushWork(() => {
            //         const { newState, commit } = this.vDomBuilder.update(this, this.htmlRep, this.currRepresentation);
            //         this.currRepresentation = newState;
            //         return commit;
            //     })
            // }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(BasicComponent.prototype, others);
        Reflect.defineMetadata('component:selector', selector, BasicComponent);
        customElements.define(selector, BasicComponent);
        return BasicComponent;
    }
}