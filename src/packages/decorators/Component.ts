import { IWorkLoop, IElementRepresentation } from '../interfaces/interfaces';
import { pushWork } from '../workLoop/work-loop';
import { representationParser, extractChanges } from '../virualDomBuilder';

export function Component({ selector }: { selector: string }): any {
	return function componentDecorator(target: any) {
		class BasicComponent extends HTMLElement {
			root: ShadowRoot;
			representation: IElementRepresentation;
			html: HTMLElement;
			render: any;

			constructor() {
				super();
				target.call(this);
				this.root = this.attachShadow({ mode: 'closed' });
				this.representation = this.render();
				this.html = representationParser(this.representation);
				this.root.appendChild(this.html);
			}

			update() {
				pushWork(() => {
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
