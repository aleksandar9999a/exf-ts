import { IElementRepresentation, ICtorStyle, Props, State } from '../interfaces/interfaces';
import { representationParser, ExFStylize, extractStyleChanges, extractChanges } from '../virualDomBuilder';
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

		pushWork(() => {
			const newRep = (this as any).render();
			const changes = extractChanges((this._root as any) as ChildNode, [this._representation], [newRep]);
			this._representation = newRep;
			return changes;
		});
	}

	setAttribute(key: string, value: any, type?: string) {
		this._props[key] = value;

		if (type === 'state') {
			this.update();
		} else if (type === 'style' && !!(this as any).stylize) {
			this.updateStyle();
		} else {
			if (!!(this as any).stylize) {
				this.updateStyle();
			}

			this.update();
		}
	}

	getAttribute(key: string) {
		return this._props[key];
	}
}
