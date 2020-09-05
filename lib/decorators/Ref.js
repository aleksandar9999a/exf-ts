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
                return this._root.getElementById(id);
            },
        });
    };
}
//# sourceMappingURL=Ref.js.map