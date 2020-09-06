import { IElementRepresentation, ICtorStyle, Props, State, Styles } from '../interfaces/interfaces';
import { representationParser, ExFStylize, extractStyleChanges, updateView } from '../virualDomBuilder';
import { pushWork } from '../workLoop/work-loop';

export class Component extends HTMLElement {
    private _root!: ShadowRoot;
    private _representation!: IElementRepresentation;
    private _html!: HTMLElement;
    private _ctorStyle: ICtorStyle = {
        styles: [],
        content: [],
    };
    private _props: Props = {};
    private _state: State = {};
    private _styles: Styles = {};

    connectedCallback() {
        this._root = this.attachShadow({ mode: 'closed' });
        this._representation = (this as any).render();
        this._html = representationParser(this._representation);

        this._root.appendChild(this._html);

        if (!!(this as any).stylize) {
            const styleRep = (this as any).stylize();
            this._ctorStyle = ExFStylize(styleRep.children);

            this._ctorStyle.styles.forEach((style) => {
                this._root.appendChild(style);
            });
        }

        if (!!(this as any).onCreate) {
            (this as any).onCreate();
        }
    }

    disconnectedCallback() {
        if (!!(this as any).onDestroy) {
            (this as any).onDestroy();
        }
    }

    private updateStyle() {
        if (!(this as any).stylize) {
            return;
        }

        pushWork(() => {
            const newRep = (this as any).stylize();
            const { rep, commit } = extractStyleChanges(this._ctorStyle, newRep.children);
            this._ctorStyle.content = rep;

            return commit;
        });
    }

    private update() {
        if (!(this as any).render || !this._root) {
            return;
        }

        const newRep = (this as any).render();
        updateView((this._root as any) as ChildNode, this._root.childNodes, [this._representation], [newRep]);
        this._representation = newRep;
    }

    setAttribute(key: string, value: any, type?: string) {
        this._props[key] = value;

        if (type === 'state') {
            this.update();
        } else if (type === 'style' && !!(this as any).stylize) {
            this.updateStyle();
        } else {
            this.update();

            if (!!(this as any).stylize) {
                this.updateStyle();
            }
        }
    }

    getAttribute(key: string) {
        return this._props[key];
    }

    setState(key: string, value: any) {
        this._state[key] = value;

        if (!!(this as any).render) {
            this.update();
        }
    }

    getState(key: string) {
        return this._state[key];
    }

    setStyle(key: string, value: any) {
        this._styles[key] = value;

        if (!!(this as any).stylize) {
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
