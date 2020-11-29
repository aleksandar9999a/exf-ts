import { IInject } from '../interfaces/interfaces';

/**
 * Inject Decorator
 *
 * @param {IInject} params
 * 
 * @return {() => Void}
 */
export function Inject(params?: IInject) {
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
					return this.getInjected(params.key);
        }

				return this.getInjected(key);
			},
		});
	};
}
