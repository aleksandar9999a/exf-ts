import { IInject } from '../interfaces/interfaces';
import { getGlobalInjected } from '../modules/modules';

/**
 * Inject Decorator
 *
 * @param {IInject} params
 * 
 * @return {() => Void}
 */
export function ModuleInjected(params?: IInject) {
	/**
	 * @param {Any} target
	 * @param {String} key
	 *
	 * @return {Void}
	 */
	return (target: any, key: string) => {
		Object.defineProperty(target, key, {
			get() {
        if (params && params.key) {
					return getGlobalInjected(params.key);
        }

				return getGlobalInjected(key);
			},
		});
	};
}
