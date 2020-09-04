import { defineWatch, findProps, findStateProp, findStyleProp } from './../metadata/metadata'
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
				currentMethod.bind(this)(...args);

				if(findStateProp(target, key)) {
					this.update();
				}

				if(findStyleProp(target, key)) {
					this.updateStyle();
				}
			}
			return;
		}

		let val: any;

		Object.defineProperty(target, key, {
			set(newValue) {
				if(findProps(target, key)) {
					this.setProps(key, newValue);
					currentMethod.bind(this)(newValue, val);
					val = newValue;
					return;
				}

				const oldValue = val;
				val = newValue;

				currentMethod.bind(this)(newValue, oldValue);
				
				if(findStateProp(target, key)) {
					this.update();
				}

				if(findStyleProp(target, key)) {
					this.updateStyle();
				}
			},
			get() {
				if(findProps(target, key)) {
					return this.getProps(key);
				}

				return val;
			}
		});
	}
}
