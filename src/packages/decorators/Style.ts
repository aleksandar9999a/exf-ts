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
 * Define style prop as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
function defineStyle(target: any, key: string) {
	const styles = Reflect.getMetadata('component:style', target) || [];
	Reflect.defineMetadata('component:style', [...styles, key], target);
}

/**
 * Style Decorator
 * 
 * @param {Any} target
 * @param {String} key
 * @param {TypedPropertyDescriptor<any>} descriptor
 *
 * @return {Void}
 */
export function Style(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) {
	defineStyle(target, key);

	if (!! findWatchedProp(target, key)) {
		return;
	}

	if (!!descriptor) {
		const currentMethod = descriptor.value;
		descriptor.value = function (this: any, ...args: any[]) {
			currentMethod(...args);
			
			if (this.updateStyle) {
				this.updateStyle();
			}
		}
		return;
	}

	let val: any;

	Object.defineProperty(target, key, {
		set(newValue) {
			val = newValue;
			
			if (this.updateStyle) {
				this.updateStyle();
			}
		},
		get() {
			return val;
		},
		configurable: true
	});
}
