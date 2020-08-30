import { IWorkLoop, IElementRepresentation, Props } from '../interfaces/interfaces';
import { pushWork } from '../workLoop/work-loop';
import { representationParser, extractChanges } from '../virualDomBuilder';

/**
 * Component Decorator
 * 
 * @param  {Object}
 * 
 * @return {Function}
 */
export function Component({ selector }: { selector: string }): any {
	return function componentDecorator(target: any) {
		class Ctor extends HTMLElement {
			root: ShadowRoot;
			representation: IElementRepresentation;
			html: HTMLElement;
			render!: Function;
			props: Props = {};

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

			setProps(key: string, value: any) {
				this.props[key] = value;
				this.update();
			}

			getProps(key: string) {
				return this.props[key];
			}
		}

		const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
		Object.defineProperties(Ctor.prototype, others);
		Reflect.defineMetadata('component:selector', selector, Ctor);
		
		customElements.define(selector, Ctor);
		return Ctor;
	}
}
