import { IElementRepresentation } from './../interfaces/interfaces';
import { events } from './events-register';
import { isExistElement } from './../modules/modules';
import { diff } from './differences'

/**
 * Parse IElementRepresentation | string to HTML Element
 *
 * @param {IElementRepresentation | string} children
 *
 * @returns {HTMLElement | Text}
 */
export function elementParser(child: IElementRepresentation | string) {
	return typeof child === 'object' ? representationParser(child) : document.createTextNode(child);
}

/**
 * Create ordinary HTML Element
 *
 * @param {IElementRepresentation}
 *
 * @return {HTMLElement}
 */
export function representationParser({ tag, props, children }: IElementRepresentation) {
	const el = document.createElement(tag);

	const isRegisteredComponent = isExistElement(tag);

	Object.keys(props || {}).forEach((key) => {
		if (!isRegisteredComponent && typeof (props as any)[key] === 'function' && !!events[key]) {
			el.addEventListener(events[key], (props as any)[key]);
		} else if (key === 'style') {
			Object.keys((props as any)[key]).forEach((style) => {
				(el as any).style[style] = (props as any)[key][style];
			});
		} else if (key === 'className') {
			el[key] = (props as any)[key];
		} else {
			el.setAttribute(key, (props as any)[key]);
		}
	});

	if (isRegisteredComponent) {
		(el as any).childs = children;
	} else {
		children.forEach((child: any) => {
			const parsedChild = elementParser(child);
			el.appendChild(parsedChild);
		});
	}

	return el;
}

/**
 * Extract Changes
 *
 * @param {ChildNode} parent
 * @param {IElementRepresentation[]} oldState
 * @param {IElementRepresentation[]} newState
 *
 * @return {(() => Void)[]}
 */
export function extractChanges(
	parent: ChildNode,
	oldState: IElementRepresentation[] = [],
	newState: IElementRepresentation[] = [],
) {
	let changes: (() => void)[] = [];

	oldState.forEach((oldEl, i) => {
		const newEl = newState[i];

		const basicChanges = basicDiff(parent.childNodes[i] || parent, oldEl, newEl);
		const childrenChanges = !!newEl && !!newEl.children
			? extractChanges(parent.childNodes[i] || parent, oldEl.children, newEl.children)
			: [];

		changes = [...changes, ...basicChanges, ...childrenChanges];
	});

	const lengthChanges = newState.length > oldState.length ? lengthDiff(parent, oldState, newState) : [];

	return [...changes, ...lengthChanges];
}

/**
 * Compare state and extract small changes
 *
 * @param {ChildNode} child
 * @param {IElementRepresentation} oldEl
 * @param {IElementRepresentation} newEl
 *
 * @returns {(() => Void)[]}
 */
function basicDiff(child: ChildNode, oldEl: IElementRepresentation, newEl: IElementRepresentation) {
	if (newEl === undefined) {
		return [() => child.remove()];
	}

	if (typeof oldEl != 'object' && typeof newEl != 'object' && oldEl !== newEl) {
		return [() => (child.textContent = newEl)];
	}

	if (oldEl.tag !== newEl.tag) {
		return [
			() => {
				const el = elementParser(newEl);
				child.replaceWith(el);
			},
		];
	}

	if (oldEl.props && newEl.props && (oldEl as any).props.id !== (newEl as any).props.id) {
		return [
			() => {
				const el = elementParser(newEl);
				child.replaceWith(el);
			},
		];
	}

	const differences = diff(oldEl.props || {}, newEl.props || {})
	const diffKeys = Object.keys(differences)

	return diffKeys.reduce((acc: (() => void)[], key) => {
		if (key === 'style') {
			acc.push(
				() => {
					Object.keys(differences[key]).forEach(style => {
						(child as any).style[style] = differences[key][style];
					});
				}
			)
		} else {
			acc.push(
				() => {
					(child as any)[key] = differences[key];
				}
			)
		}

		return acc
	}, [])
}

/**
 * Comapare state length and create new elements
 *
 * @param {ChildNode} parent
 * @param {IElementRepresentation[]} oldState
 * @param {IElementRepresentation[]} newState
 *
 * @return {(() => Void)[]}
 */
function lengthDiff(
	parent: ChildNode,
	oldState: IElementRepresentation[] = [],
	newState: IElementRepresentation[] = [],
) {
	const itemsLeft = newState.slice(oldState.length);

	return [
		() => {
			itemsLeft.forEach((item) => {
				const el = elementParser(item);
				parent.appendChild(el);
			});
		},
	];
}
