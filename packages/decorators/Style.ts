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
    Object.defineProperty(target, key, {
        set(newValue) {
            this.setStyle(key, newValue);
        },
        get() {
            return this.getStyle(key);
        },
    });
}
