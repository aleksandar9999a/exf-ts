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
import 'reflect-metadata';
import { metakeys } from './metakeys';
/**
 * Define metadate
 *
 * @param {String} metakey
 * @param {Any}    target
 * @param {String} key
 *
 * @return {Void}
 */
function define(metakey, target, key) {
    var data = Reflect.getMetadata(metakey, target) || [];
    Reflect.defineMetadata(metakey, __spread(data, [key]), target);
}
/**
 * Find key in metadata
 *
 * @param {String} metakey
 * @param {Any}    target
 * @param {String} key
 *
 * @return {Bool}
 */
function find(metakey, target, key) {
    var data = Reflect.getMetadata(metakey, target, key) || [];
    return data.includes(key);
}
/**
 * Find watched prop if it is registered
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Bool}
 */
export function findWatchedProp(target, key) {
    return find(metakeys.META_WATCHES, target, key);
}
/**
 * Define prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineProp(target, key) {
    define(metakeys.META_PROPS, target, key);
}
/**
 * Define prop as state as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineState(target, key) {
    define(metakeys.META_STATE, target, key);
}
/**
 * Define style prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineStyle(target, key) {
    define(metakeys.META_STYLE, target, key);
}
/**
 * Define Watched Prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 * @param {Any} method
 *
 * @return {Void}
 */
export function defineWatch(target, key, method) {
    define(metakeys.META_WATCHES, target, key);
}
/**
 * Find prop if it is registered like state
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findStateProp(target, key) {
    return find(metakeys.META_STATE, target, key);
}
/**
 * Find prop if it is registered like style
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findStyleProp(target, key) {
    return find(metakeys.META_STYLE, target, key);
}
/**
 * Find props
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findProps(target, key) {
    return find(metakeys.META_PROPS, target, key);
}
//# sourceMappingURL=metadata.js.map