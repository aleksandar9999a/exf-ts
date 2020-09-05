import { IElementRepresentation, IUpdateHTML } from './../interfaces/interfaces';
import { events } from './events-register';

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
 * Extract changes and return commit function
 *
 * @param {NodeListOf<ChildNode>} childNodes
 * @param {IElementRepresentation} firstRep
 * @param {IElementRepresentation} secondRep
 *
 * @returns {() => updateHTML()}
 */
export function extractChanges(
    childNodes: NodeListOf<ChildNode>,
    firstRep: IElementRepresentation,
    secondRep: IElementRepresentation,
) {
    return () =>
        updateHTML({
            parent: childNodes[0],
            childrens: childNodes,
            changes: compareRepresentations([firstRep], [secondRep]),
        });
}

/**
 * Commit changes to ui
 *
 * @param {IUpdateHTML} data
 *
 * @returns {Void}
 */
function updateHTML({ parent, childrens, changes }: IUpdateHTML) {
    changes.forEach((change: any) => {
        const currEl = childrens[change.elementIndex];
        const propKeys = Object.keys(change.props || {});

        propKeys.forEach((key: any) => {
            (currEl as any)[key] = change.props[key];
        });

        if (!!change.removeElement) {
            (currEl as HTMLElement).remove();
        }

        if (!!change.content) {
            (currEl || parent).textContent = change.content;
        }

        if (!!change.children && !!currEl) {
            updateHTML({
                parent: currEl,
                childrens: currEl.childNodes,
                changes: change.children,
            });

            return;
        }

        if (!!change.children && !currEl) {
            change.children.forEach((el: IElementRepresentation | string) => {
                parent.appendChild(elementParser(el));
            });
        }
    });
}

/**
 * Compare Representation and extract changes
 *
 * @param {IElementRepresentation[]} oldState
 * @param {IElementRepresentation[]} newState
 *
 * @returns {Array}
 */
function compareRepresentations(oldState: IElementRepresentation[] = [], newState: IElementRepresentation[] = []) {
    const changes: any = [];

    oldState.forEach((oldEl, i) => {
        const newEl = newState[i];
        const change: any = { elementIndex: i };
        let hasChange = false;

        if (!newEl) {
            change.removeElement = oldEl;
            changes.push(change);

            return;
        }

        if (typeof oldEl === 'string' && typeof newEl === 'string' && oldEl !== newEl) {
            change.content = newEl;
            changes.push(change);

            return;
        }

        if (oldEl.tag !== newEl.tag) {
            change.element = newEl;
            changes.push(change);

            return;
        }

        const oldElProps = Object.keys(oldEl.props || {});

        oldElProps.forEach((key: any) => {
            const oldProp = (oldEl.props as any)[key];
            const newProp = (newEl.props as any)[key];

            if (oldProp !== newProp) {
                if (!change.props) {
                    change.props = {};
                }

                change.props[key] = newProp;
                hasChange = true;
            }
        });

        const children = compareRepresentations(oldEl.children, newEl.children);

        if (children.length > 0) {
            change.children = children;
            hasChange = true;
        }

        if (hasChange) {
            changes.push(change);
        }
    });

    if (oldState.length < newState.length) {
        const itemsLeft = newState.slice(oldState.length);

        const change = {
            elementIndex: -1,
            children: itemsLeft,
        };

        changes.push(change);
    }

    return changes;
}
