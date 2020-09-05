var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { pushWork } from '../workLoop/work-loop';
import { representationParser, extractChanges, ExFStylize, extractStyleChanges } from '../virualDomBuilder';
/**
 * Component Decorator
 *
 * @param  {Object}
 *
 * @return {Function}
 */
export function Component(_a) {
    var selector = _a.selector;
    return function componentDecorator(target) {
        var Ctor = /** @class */ (function (_super) {
            __extends(Ctor, _super);
            function Ctor() {
                var _this = _super.call(this) || this;
                _this._props = {};
                _this._state = {};
                _this._styles = {};
                target.call(_this);
                _this._root = _this.attachShadow({ mode: 'closed' });
                _this._representation = _this.render();
                _this._html = representationParser(_this._representation);
                _this._root.appendChild(_this._html);
                if (!!_this.stylize) {
                    var styleRep = _this.stylize();
                    _this._ctorStyle = ExFStylize(styleRep.children);
                    _this._ctorStyle.styles.forEach(function (style) {
                        _this._root.appendChild(style);
                    });
                }
                return _this;
            }
            Ctor.prototype.updateStyle = function () {
                var _this = this;
                if (!this.stylize) {
                    return;
                }
                pushWork(function () {
                    var newRep = _this.stylize();
                    var _a = extractStyleChanges(_this._ctorStyle, newRep.children), rep = _a.rep, commit = _a.commit;
                    _this._ctorStyle.content = rep;
                    return commit;
                });
            };
            Ctor.prototype.update = function () {
                var _this = this;
                pushWork(function () {
                    var newRep = _this.render();
                    var commit = extractChanges(_this._root.childNodes, _this._representation, newRep);
                    _this._representation = newRep;
                    return commit;
                });
            };
            Ctor.prototype.setProps = function (key, value) {
                this._props[key] = value;
                this.update();
                if (!!this.stylize) {
                    this.updateStyle();
                }
            };
            Ctor.prototype.getProps = function (key) {
                return this._props[key];
            };
            Ctor.prototype.setState = function (key, value) {
                this._state[key] = value;
                if (!!this.render) {
                    this.update();
                }
            };
            Ctor.prototype.getState = function (key) {
                return this._state[key];
            };
            Ctor.prototype.setStyle = function (key, value) {
                this._styles[key] = value;
                if (!!this.stylize) {
                    this.updateStyle();
                }
            };
            Ctor.prototype.getStyle = function (key) {
                return this._styles[key];
            };
            Ctor.prototype.findProp = function (key) {
                return this._props.hasOwnProperty(key);
            };
            Ctor.prototype.findStyle = function (key) {
                return this._styles.hasOwnProperty(key);
            };
            Ctor.prototype.findState = function (key) {
                return this._state.hasOwnProperty(key);
            };
            return Ctor;
        }(HTMLElement));
        var _a = Object.getOwnPropertyDescriptors(target.prototype), constructor = _a.constructor, others = __rest(_a, ["constructor"]);
        Object.defineProperties(Ctor.prototype, others);
        Object.defineProperty(Ctor.prototype, 'selector', {
            value: selector,
            writable: false,
        });
        customElements.define(selector, Ctor);
        return Ctor;
    };
}
//# sourceMappingURL=Component.js.map