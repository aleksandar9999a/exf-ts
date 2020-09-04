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
import { defineWatch, findProps, findStateProp, findStyleProp } from './../metadata/metadata';
/**
 * Watch Decorator
 *
 * @param  {String} key
 *
 * @return {Function}
 */
export function Watch(key) {
    return function (target, fn, descriptor) {
        var currentProperty = target[key];
        var currentMethod = descriptor.value;
        defineWatch(target, key, currentMethod);
        if (typeof currentProperty === 'function') {
            target[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                currentProperty.bind(this).apply(void 0, __spread(args));
                currentMethod.bind(this).apply(void 0, __spread(args));
                if (findStateProp(target, key)) {
                    this.update();
                }
                if (findStyleProp(target, key)) {
                    this.updateStyle();
                }
            };
            return;
        }
        var val;
        Object.defineProperty(target, key, {
            set: function (newValue) {
                if (findProps(target, key)) {
                    this.setProps(key, newValue);
                    currentMethod.bind(this)(newValue, val);
                    val = newValue;
                    return;
                }
                var oldValue = val;
                val = newValue;
                currentMethod.bind(this)(newValue, oldValue);
                if (findStateProp(target, key)) {
                    this.update();
                }
                if (findStyleProp(target, key)) {
                    this.updateStyle();
                }
            },
            get: function () {
                if (findProps(target, key)) {
                    return this.getProps(key);
                }
                return val;
            },
        });
    };
}
//# sourceMappingURL=Watch.js.map