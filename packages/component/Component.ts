import { IElementRepresentation, ICtorStyle, Props, State } from '../interfaces/interfaces';
import { representationParser, ExFStylize, extractStyleChanges, extractChanges } from '../virualDomBuilder';
import { pushWork } from '../workLoop/work-loop';

export class Component extends HTMLElement {
	private _root!: ShadowRoot;
	private _representation!: IElementRepresentation;
	private _ctorStyle: ICtorStyle = {
		styles: [],
		content: [],
	};
	private _props: Props = {};
	private _state: State = {};

	private _html!: HTMLElement;

	onDestroy() {}
	onCreate() {}
	stylize() { return { tag: 'style', props: {}, children: [] } }
	render() { return { tag: 'div', props: {}, children: [] } }
	getHTML () { return this._html; }

	connectedCallback() {
		this.initComponent()
		this.onCreate();
	}

	disconnectedCallback() {
		this.onDestroy();
	}

	private initComponent () {
		const mode = typeof (this as any).shadowMode === 'string'
		? (this as any).shadowMode
		: 'closed'

		this._root = this.attachShadow({ mode });
		this._representation = this.render();
		this._html = representationParser(this._representation);

		this._root.appendChild(this._html);

		const styleRep = this.stylize();

		if (styleRep.children.length === 0) {
			return;
		}

		this._ctorStyle = ExFStylize(styleRep.children);

		this._ctorStyle.styles.forEach(style => {
			this._root.appendChild(style);
		});
	}

	private updateStyle() {
		pushWork(() => {
			const newRep = this.stylize();
			const { rep, commit } = extractStyleChanges(this._root as any as ChildNode, this._ctorStyle, newRep.children);
			this._ctorStyle = rep;

			return commit;
		});
	}

	private update() {
		if (!this._root) {
			return;
		}

		pushWork(() => {
			const newRep = this.render();
			const changes = extractChanges(this._root as any as ChildNode, [this._representation], [newRep]);
			this._representation = newRep;
			return changes;
		});
	}

	setAttribute(key: string, value: any, type?: string) {
		this._props[key] = value;

		if (type === 'state') {
			this.update();
		} else if (type === 'style') {
			this.updateStyle();
		} else {
			this.updateStyle();
			this.update();
		}
	}

	getAttribute(key: string) {
		return this._props[key];
	}
}
