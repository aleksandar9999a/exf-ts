/**
 * Props Decorator
 *
 * @param  {Any} target
 * @param  {String} key
 *
 * @return {Void}
 */
export function Props(target: any, key: string): any {
    Object.defineProperty(target, key, {
        set(newValue) {
            this.setProps(key, newValue);
        },
        get() {
            return this.getProps(key);
        },
    });
}
