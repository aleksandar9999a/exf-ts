/**
 * Find watched prop if it is registered
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Undefined | Object}
 */
function findWatchedProp(target: any, key: string) {
	const watches = Reflect.getMetadata('component:watches', target) || [];

	return watches.find((prop: Object) => {
		return Object.keys(prop).includes(key);
	})
}

/**
 * Define prop as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
function defineProp(target: any, key: string) {
	const props = Reflect.getMetadata('component:props', target) || [];
	Reflect.defineMetadata('component:props', [...props, key], target);
}

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
