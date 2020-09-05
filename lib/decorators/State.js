/**
 * State Decorator
 *
 * @param {Any} target
 * @param {String} key
 * @param {TypedPropertyDescriptor<any>} descriptor
 *
 * @return {Void}
 */
export function State(target, key, descriptor) {
    Object.defineProperty(target, key, {
        set: function (newValue) {
            this.setState(key, newValue);
        },
        get: function () {
            return this.getState(key);
        },
    });
}
//# sourceMappingURL=State.js.map