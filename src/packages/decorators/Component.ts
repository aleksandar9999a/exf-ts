import { IWorkLoop, IElementRepresentation, Props, ICtorStyle } from '../interfaces/interfaces';
import { pushWork } from '../workLoop/work-loop';
import { representationParser, extractChanges, ExFStylize, extractStyleChanges } from '../virualDomBuilder';

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
			ctorStyle!: ICtorStyle;
			render!: Function;
			stylize!: Function;
			props: Props = {};


			constructor() {
				super();
				target.call(this);
				this.root = this.attachShadow({ mode: 'closed' });
				this.representation = this.render();
				this.html = representationParser(this.representation);
				
				this.root.appendChild(this.html);

				if(!! this.stylize) {
					const styleRep = this.stylize();
					this.ctorStyle = ExFStylize(styleRep.children);

					this.ctorStyle.styles.forEach(style => {
						this.root.appendChild(style);
					})
				}
			}

			updateStyle() {
				if(! this.stylize) {
					return;
				}
				
				pushWork(() => {
					const newRep = this.stylize();

					return extractStyleChanges(this.ctorStyle, newRep.children);
				})
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
