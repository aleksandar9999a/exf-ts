import { IElementRepresentation } from './../interfaces/interfaces';
import { events } from './events-register';
import { pushWork } from './../workLoop/work-loop';

/**
 * Parse IElementRepresentation | string to HTML Element
 *
 * @param {IElementRepresentation | string} children
 *
 * @returns {HTMLElement | Text}
 */
function elementParser(child: IElementRepresentation | string) {
    return typeof child === 'string' ? document.createTextNode(child) : representationParser(child);
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

    Object.keys(props || {}).forEach((key) => {
        if (typeof (props as any)[key] === 'function' && !!events[key]) {
            el.addEventListener(events[key], (props as any)[key]);
        } else if (key === 'style') {
            const styleProps = Object.keys((props as any)[key]);

            styleProps.forEach((style) => {
                (el as any).style[style] = (props as any)[key][style];
            });
        } else {
            (el as any)[key] = (props as any)[key];
        }
    });

    children.map(elementParser).forEach((child: any) => {
        el.appendChild(child);
    });

    return el;
}

/**
 * Update HTML
 *
 * @param {ChildNode} parent
 * @param {NodeListOf<ChildNode>} childNodes
 * @param {IElementRepresentation[]} oldState
 * @param {IElementRepresentation[]} newState
 *
 * @return {Void}
 */
export function updateView(
    parent: ChildNode,
    childNodes: NodeListOf<ChildNode>,
    oldState: IElementRepresentation[] = [],
    newState: IElementRepresentation[] = [],
) {
    oldState.forEach((oldEl, i) => {
        const newEl = newState[i];

        pushWork(basicDiff.bind(undefined, childNodes[i], oldEl, newEl));
        updateView(childNodes[i], childNodes[i].childNodes, oldEl.children, newEl.children);
        pushWork(lengthDiff.bind(undefined, parent, oldState, newState));
    });
}

/**
 * Compare state and commit small changes
 *
 * @param {ChildNode} child
 * @param {IElementRepresentation} oldEl
 * @param {IElementRepresentation} newEl
 *
 * @returns {() => Void[]}
 */
function basicDiff(child: ChildNode, oldEl: IElementRepresentation, newEl: IElementRepresentation) {
    if (!newEl) {
        return [() => child.remove()];
    }

    if (typeof oldEl === 'string' && typeof newEl === 'string' && oldEl !== newEl) {
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

    return Object.keys(oldEl.props || {}).reduce((arr: any[], key: string) => {
        const oldProp = (oldEl.props as any)[key];
        const newProp = (newEl.props as any)[key];

        const fn = () => (child as HTMLElement).setAttribute(key, newProp);

        return oldProp !== newProp ? [...arr, fn] : arr;
    }, []);
}

/**
 * Comapare state and commit new elements
 *
 * @param {ChildNode} parent
 * @param {IElementRepresentation[]} oldState
 * @param {IElementRepresentation[]} newState
 *
 * @return {() => Void}
 */
function lengthDiff(
    parent: ChildNode,
    oldState: IElementRepresentation[] = [],
    newState: IElementRepresentation[] = [],
) {
    const itemsLeft = newState.slice(oldState.length);

    return () => {
        itemsLeft.forEach((item) => {
            const el = elementParser(item);
            parent.appendChild(el);
        });
    };
}
