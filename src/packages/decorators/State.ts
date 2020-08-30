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
 * Define prop as state as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
function defineState(target: any, key: string) {
	const states = Reflect.getMetadata('component:states', target) || [];
	Reflect.defineMetadata('component:states', [...states, key], target);
}

/**
 * State Decorator
 * 
 * @param {Any} target
 * @param {String} key
 * @param {TypedPropertyDescriptor<any>} descriptor
 *
 * @return {Void}
 */
export function State(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) {
	defineState(target, key);

	if (!! findWatchedProp(target, key)) {
		return;
	}

	if (!!descriptor) {
		const currentMethod = descriptor.value;
		descriptor.value = function (this: any, ...args: any[]) {
			currentMethod(...args);
			
			if (this.update) {
				this.update();
			}
		}
		return;
	}

	let val: any;

	Object.defineProperty(target, key, {
		set(newValue) {
			val = newValue;
			
			if (this.update) {
				this.update();
			}
		},
		get() {
			return val;
		},
		configurable: true
	});
}
