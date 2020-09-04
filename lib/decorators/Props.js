import { defineProp, findWatchedProp } from './../metadata/metadata';
/**
 * Props Decorator
 *
 * @param  {Any} target
 * @param  {String} key
 *
 * @return {Void}
 */
export function Props(target, key) {
    defineProp(target, key);
    if (findWatchedProp(target, key)) {
        return;
    }
    Object.defineProperty(target, key, {
        set: function (newValue) {
            if (typeof this.setProps === 'function') {
                this.setProps(key, newValue);
            }
        },
        get: function () {
            if (typeof this.getProps === 'function') {
                return this.getProps(key);
            }
            return undefined;
        },
        configurable: true,
    });
}
//# sourceMappingURL=Props.js.map