/**
 * Define Watched Prop as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 * @param {Any} method
 *
 * @return {Void}
 */
function defineWatch(target: any, key: string, method: any) {
		const watches = Reflect.getMetadata('component:watches', target) || [];
		Reflect.defineMetadata('component:watches', [...watches, { [key]: method }], target);
}

/**
 * Find prop if it is registered like state
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
function findStateProp(target: any, key: string) {
	const states = Reflect.getMetadata('component:states', target) || [];
	return states.includes(key);
}

/**
 * Watch Decorator
 * 
 * @param  {String} key
 * 
 * @return {Function}
 */
export function Watch(key: string ): any {
	return function(target: any, fn: string,  descriptor: TypedPropertyDescriptor<any>) {
		const currentProperty = target[key];
		const currentMethod = descriptor.value;

		defineWatch(target, key, currentMethod);

		if(typeof currentProperty === 'function') {
			target[key] = function (this: any, ...args: any[]) {
				currentProperty.bind(this)(...args);
				currentMethod(...args);

				if(findStateProp(target, key)) {
					this.update();
				}
			}
			return;
		}

		let val: any;

		Object.defineProperty(target, key, {
			set(newValue) {
				const oldValue = val;
				val = newValue;

				currentMethod(newValue, oldValue);

				if(findStateProp(target, key)) {
					this.update();
				}
			},
			get() {
				return val;
			}
		});
	}
}
