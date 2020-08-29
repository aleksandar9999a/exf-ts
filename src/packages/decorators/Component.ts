import { IWorkLoop, IElementRepresentation } from '../interfaces/interfaces';
import { workLoopFactory } from '../factories/factories';
import { representationParser, extractChanges } from '../virualDomBuilder';

export function Component({ selector }: { selector: string }): any {
    return function componentDecorator(target: any) {

        class BasicComponent extends HTMLElement {
            private workLoop: IWorkLoop;
            root: ShadowRoot;
            representation: IElementRepresentation;
            html: HTMLElement;
            render: any;

            constructor() {
                super();
                target.call(this);
                this.root = this.attachShadow({ mode: 'closed' });
                this.workLoop = workLoopFactory();
                this.representation = this.render();
                this.html = representationParser(this.representation);
                this.root.appendChild(this.html);
            }

            update() {
                if (!this.workLoop) { 
                    return; 
                }
                
                this.workLoop.pushWork(() => {
                    const newRep = this.render();
                    const commit = extractChanges(this.root.childNodes, this.representation, newRep);
                    this.representation = newRep;
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