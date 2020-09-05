/**
 * Props Decorator
 *
 * @param  {Any} target
 * @param  {String} key
 *
 * @return {Void}
 */
export function Props(target, key) {
    Object.defineProperty(target, key, {
        set: function (newValue) {
            this.setProps(key, newValue);
        },
        get: function () {
            return this.getProps(key);
        },
    });
}
//# sourceMappingURL=Props.js.map