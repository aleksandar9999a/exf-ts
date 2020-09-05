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
var container = {
    components: {},
    bootstraps: {}
};
/**
 * Create Component
 *
 * @param  {Class} Ctor
 * @param  {String} innerHTML
 * @param  {Object} bindings
 *
 * @return {Object}
 */
function createComponent(Ctor, innerHTML, bindings) {
    var instance = new Ctor();
    instance.textContent = innerHTML;
    Object.entries(bindings || {}).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        instance[key] = value;
    });
    return instance;
}
/**
 * Bootstrap
 *
 * @param  {String} id
 * @param  {Object} component
 *
 * @return {Void}
 */
function bootstrap(id, component) {
    var root = document.getElementById(id);
    var instance = createComponent(component);
    root === null || root === void 0 ? void 0 : root.appendChild(instance);
}
/**
 * Register components in target
 *
 * @param  {Object} target
 * @param  {Class} cmp
 *
 * @return {Void}
 */
function register(target, cmp) {
    var selector = cmp.prototype.selector;
    if (target[selector]) {
        throw new Error("Component " + selector + " is already registered!");
    }
    target[selector] = cmp;
}
/**
 * Create module with components
 *
 * @param {IExfModule}
 *
 * @returns {Void}
 */
export function ExFModule(_a) {
    var components = _a.components, modules = _a.modules, bootstraps = _a.bootstraps, root = _a.root;
    (components || []).forEach(function (cmp) {
        register(container.components, cmp);
    });
    (modules || []).forEach(ExFModule);
    if (!!root) {
        (bootstraps || []).forEach(function (cmp) {
            bootstrap(root, cmp);
        });
    }
}
//# sourceMappingURL=modules.js.map