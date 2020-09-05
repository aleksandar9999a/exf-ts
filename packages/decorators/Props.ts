/**
 * Props Decorator
 *
 * @param  {Any} target
 * @param  {String} key
 *
 * @return {Void}
 */
export function Props(type?: string) {
    return (target: any, key: string) => {
        Object.defineProperty(target, key, {
            set(newValue) {
                this.setAttribute(key, newValue, type);
            },
            get() {
                return this.getAttribute(key);
            },
        });
    };
}
