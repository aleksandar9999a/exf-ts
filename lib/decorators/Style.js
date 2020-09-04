var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { defineStyle, findWatchedProp } from './../metadata/metadata';
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
    defineStyle(target, key);
    if (!!findWatchedProp(target, key)) {
        return;
    }
    if (!!descriptor) {
        var currentMethod_1 = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            currentMethod_1.apply(void 0, __spread(args));
            if (this.updateStyle) {
                this.updateStyle();
            }
        };
        return;
    }
    var val;
    Object.defineProperty(target, key, {
        set: function (newValue) {
            val = newValue;
            if (this.updateStyle) {
                this.updateStyle();
            }
        },
        get: function () {
            return val;
        },
        configurable: true,
    });
}
//# sourceMappingURL=Style.js.map