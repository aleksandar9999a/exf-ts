import { defineProp, findWatchedProp } from './../metadata/metadata';

/**
 * Props Decorator
 * 
 * @param  {Any} target
 * @param  {String} key
 * 
 * @return {Void}
 */
export function Props(target: any, key: string): any {
	defineProp(target, key);

	if(findWatchedProp(target, key)) {
		return;
	}

	Object.defineProperty(target, key, {
		set(newValue) {
			if(typeof this.setProps === 'function') {
				this.setProps(key, newValue);
			}
		},
		get() {
			if(typeof this.getProps === 'function') {
				return this.getProps(key);
			}

			return undefined;
		},
		configurable: true
	});
}
