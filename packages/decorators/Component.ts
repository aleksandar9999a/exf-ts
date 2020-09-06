import { IElementRepresentation, Props, ICtorStyle, State, Styles } from '../interfaces/interfaces';
import { pushWork } from '../workLoop/work-loop';
import { representationParser, extractChanges, ExFStylize, extractStyleChanges } from '../virualDomBuilder';

/**
 * Component Decorator
 *
 * @param  {Object}
 *
 * @return {Function}
 */
export function Component({ selector }: { selector: string }): any {
    return function componentDecorator(target: any) {
        class Ctor extends HTMLElement {
            private _root: ShadowRoot;
            private _representation: IElementRepresentation;
            private _html: HTMLElement;
            private _ctorStyle!: ICtorStyle;
            private _props: Props = {};
            private _state: State = {};
            private _styles: Styles = {};

            private render!: () => IElementRepresentation;
            private stylize!: () => IElementRepresentation;

            constructor(...arg: any) {
                super();
                target.call(this, ...arg);
                this._root = this.attachShadow({ mode: 'closed' });
                this._representation = this.render();
                this._html = representationParser(this._representation);

                this._root.appendChild(this._html);

                if (!!this.stylize) {
                    const styleRep = this.stylize();
                    this._ctorStyle = ExFStylize(styleRep.children);

                    this._ctorStyle.styles.forEach((style) => {
                        this._root.appendChild(style);
                    });
                }
            }

            private updateStyle() {
                if (!this.stylize) {
                    return;
                }

                pushWork(() => {
                    const newRep = this.stylize();
                    const { rep, commit } = extractStyleChanges(this._ctorStyle, newRep.children);
                    this._ctorStyle.content = rep;

                    return commit;
                });
            }

            private update() {
                pushWork(() => {
                    const newRep = this.render();
                    const commit = extractChanges(this._root.childNodes, this._representation, newRep);
                    this._representation = newRep;
                    return commit;
                });
            }

            setAttribute(key: string, value: any, type?: string) {
                this._props[key] = value;

                if (type === 'state') {
                    this.update();
                } else if (type === 'style' && !!this.stylize) {
                    this.updateStyle();
                } else {
                    this.update();

                    if (!!this.stylize) {
                        this.updateStyle();
                    }
                }
            }

            getAttribute(key: string) {
                return this._props[key];
            }

            setState(key: string, value: any) {
                this._state[key] = value;

                if (!!this.render) {
                    this.update();
                }
            }

            getState(key: string) {
                return this._state[key];
            }

            setStyle(key: string, value: any) {
                this._styles[key] = value;

                if (!!this.stylize) {
                    this.updateStyle();
                }
            }

            getStyle(key: string) {
                return this._styles[key];
            }

            findProp(key: string) {
                return this._props.hasOwnProperty(key);
            }

            findStyle(key: string) {
                return this._styles.hasOwnProperty(key);
            }

            findState(key: string) {
                return this._state.hasOwnProperty(key);
            }
        }

        const { constructor, ...others } = Object.getOwnPropertyDescriptors(target.prototype);
        Object.defineProperties(Ctor.prototype, others);

        Object.defineProperty(Ctor.prototype, 'selector', {
            value: selector,
            writable: false,
        });

        customElements.define(selector, Ctor);
        return Ctor;
    };
}
