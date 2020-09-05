import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { Component, Props, State, Ref, Style } from './decorators';
import { ExFModule } from './modules/modules';
export { Component, Props, State, Ref, Style, ExFModule };
/**
 * ExF - Default JSX Engine
 *
 * @param {String} tag
 * @param {Any} props
 * @param {Array} children
 *
 * @returns {Object}
 */
export default function ExF(tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    children = children.flat().filter(function (child) { return child !== null; });
    return {
        tag: tag,
        props: props || {},
        children: children,
    };
}
//# sourceMappingURL=index.js.map