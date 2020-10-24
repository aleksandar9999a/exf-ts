import { bindDependencies } from "../dependencyInjection/dependencyInjection";
import { Ctr, ICustomElement } from "../interfaces/interfaces";


/**
 * Define custom element
 * 
 * @param {Object} param
 * 
 * @return {Ctr<any>}
 */
export function CustomElement({ selector, dependencyInjection, shadowMode }: ICustomElement) {
	return (target: Ctr<any>) => {
		const element = !!dependencyInjection
			? bindDependencies(target)
			: target

		Object.defineProperty(element.prototype, 'selector', {
			value: selector,
			writable: false
		});

		if (typeof shadowMode === 'string') {
			element.shadowMode = shadowMode;
		}

		customElements.define(selector, element);
		return element;
	};
}
