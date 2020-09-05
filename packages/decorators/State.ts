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
    Object.defineProperty(target, key, {
        set(newValue) {
            this.setState(key, newValue);
        },
        get() {
            return this.getState(key);
        },
    });
}
