import { bindDependencies } from "../dependencyInjection/dependencyInjection";
import { Ctr } from "../interfaces/interfaces";

/**
 * Define custom element
 * 
 * @param {Object} param
 * 
 * @return {Ctr<any>}
 */
export function CustomElement({ selector }: { selector: string }) {
	return (target: Ctr<any>) => {
		Object.defineProperty(target.prototype, 'selector', {
			value: selector,
			writable: false,
		});

		customElements.define(selector, target);
		return bindDependencies(target);
	};
}
