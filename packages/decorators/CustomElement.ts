import { bindDependencies } from "../dependencyInjection/dependencyInjection";
import { Ctr } from "../interfaces/interfaces";

/**
 * Define custom element
 * 
 * @param {Object} param
 * 
 * @return {Ctr<any>}
 */
export function CustomElement({ selector, dependencyInjection }: { selector: string, dependencyInjection?: boolean }) {
	return (target: Ctr<any>) => {
		const element = !!dependencyInjection
			? bindDependencies(target)
			: target

		Object.defineProperty(element.prototype, 'selector', {
			value: selector,
			writable: false,
		});

		customElements.define(selector, element);
		return element
	};
}
