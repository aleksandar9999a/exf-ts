/**
 * Style Decorator
 *
 * @param {Any} target
 * @param {String} key
 * @param {TypedPropertyDescriptor<any>} descriptor
 *
 * @return {Void}
 */
export function Style(target, key, descriptor) {
    Object.defineProperty(target, key, {
        set: function (newValue) {
            this.setStyle(key, newValue);
        },
        get: function () {
            return this.getStyle(key);
        },
    });
}
//# sourceMappingURL=Style.js.map