/**
 * Ref Decorator
 *
 * @param  {Object}
 *
 * @return {Function}
 */
export function Ref(_a) {
    var id = _a.id;
    return function (target, key) {
        Object.defineProperty(target, key, {
            get: function () {
                if (typeof this.root.getElementById === 'function') {
                    return this.root.getElementById(id);
                }
                return;
            },
        });
    };
}
//# sourceMappingURL=Ref.js.map