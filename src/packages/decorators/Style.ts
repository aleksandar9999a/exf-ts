import { defineStyle, findWatchedProp } from './../metadata/metadata';

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
