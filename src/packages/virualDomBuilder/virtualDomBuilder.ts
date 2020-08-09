import { IElementRepresentation, IChange, IUpdateHTML } from "./../interfaces/interfaces";
import { events } from './events-register';
import { editService } from './editService';

/**
 * Check value
 * 
 * @param {Any} val 
 * @param {Any} fallback 
 */
function nonNull(val: any, fallback: any) {
    return !!val
        ? val
        : fallback
};

/**
 * Parse childs to html elements
 * 
 * @param {Array} children 
 * 
 * @returns {HTMLElement | Text}
 */
function childrenParser(children: IElementRepresentation[] = []) {
    return children.map((child: IElementRepresentation | string) => {
        if (typeof child === 'string') {
            return document.createTextNode(child);
        }
        return representationParser(child);
    })
}

/**
 * Parse HTML Representation
 * 
 * @param {Object} representation 
 * 
 * @returns {HTMLElement}
 */
export function representationParser({ tag, props, children }: IElementRepresentation) {
    const el = document.createElement(tag);

    Object.keys(nonNull(props, {})).forEach((key: any) => {
        if (typeof (props as any)[key] === 'function' && !!events[key]) {
            console.log();

            el.addEventListener(events[key], (props as any)[key]);
        } else {
            (el as any)[key] = props[key];
        }
    })

    childrenParser(children).forEach((child: any) => {
        el.appendChild(child);
    });

    return el;
}

/**
 * ExF - Default JSX Engine
 * 
 * @param {String} tag 
 * @param {Any} props 
 * @param {Array} children 
 * 
 * @returns {Object}
 */
export function ExF(tag: string | Function, props: any, ...children: (string | IElementRepresentation)[]) {
    if (typeof tag === 'function') {
        return tag({
            ...nonNull(props, {}),
            children
        });
    }
    return { tag, props, children };
}

/**
 * Extract changes and return commit function
 * 
 * @param {Object} firstRep 
 * @param {Object} secondRep 
 * 
 * @returns {Function}
 */
export function extractChanges(context: any, firstRep: IElementRepresentation, secondRep: IElementRepresentation) {
    return () => {
        return updateHTML({
            parent: context.root.childNodes[0],
            childrens: context.root.childNodes,
            map: compareRepresentations([firstRep], [secondRep]),
            context
        })
    };
}

/**
 * Commit changes to ui
 * 
 * @param {Object} data
 * 
 * @returns {Void}
 */
function updateHTML({ parent, childrens, map, context }: IUpdateHTML) {
    map.forEach(({ index, changes }) => {
        const element = childrens[index];
        changes.forEach(({ name, value }: any) => {
            if (name === 'loopChanges') {
                updateHTML({ parent: element, childrens: element.childNodes, map: value, context })
            } else if (typeof (editService as any)[name] === 'function') {
                (editService as any)[name]({ context, parent, element, value });
            } else {
                throw new Error(`Method ${name} is unknown!`);
            }
        })
    })
}

/**
 * Compare Representation 
 * 
 * @param {Array} oldState 
 * @param {Array} newState 
 * 
 * @returns {Array}
 */
function compareRepresentations(oldState: IElementRepresentation[], newState: IElementRepresentation[]): any {
    let changes: any = [];
    let state = compareLength(oldState, newState);

    state.longer.forEach((el, i) => {
        const revEl = state.shorter[i];
        let change: any = {
            index: i,
            changes: compareTwoElements(revEl, el, state.length)
        };

        if (change.changes.length > 0) {
            changes = [...changes, change];
        }
    })

    return changes;
}

/**
 * Compare states length
 * 
 * @param {Array} oldState 
 * @param {Array} newState 
 * 
 * @returns {Object}
 */
function compareLength(oldState: IElementRepresentation[] = [], newState: IElementRepresentation[] = []) {
    let state = {
        length: 'newState',
        shorter: oldState,
        longer: newState
    }

    if (oldState.length > newState.length) {
        state.length = 'oldState';
        state.shorter = newState;
        state.longer = oldState;
    } else {
        state.length = 'equal';
    }

    return state;
}

/**
 * Compare two element representations
 * 
 * @param {Object} firstEl 
 * @param {Object} secondEl 
 * @param {String} stateLenght 
 * 
 * @returns {Array}
 */
function compareTwoElements(firstEl: IElementRepresentation, secondEl: IElementRepresentation, stateLenght: string) {
    let changes: IChange[] = [];
    let elements = {
        first: firstEl,
        second: secondEl
    }

    if (stateLenght === 'oldState') {
        elements = {
            first: secondEl,
            second: firstEl
        }
    }

    if (!elements.first && !!elements.second && (stateLenght === 'newState' || stateLenght === "equal")) {
        changes = [...changes, { name: 'addElement', value: elements.second }];
        return changes;
    }

    if (!!elements.first && !!elements.second) {
        const tags = compareTags(elements.first, elements.second)
        changes = [...changes, ...tags];
        if (tags.length > 0) {
            return changes;
        }
    }

    if (!!elements.first && !!elements.second) {
        changes = [
            ...changes,
            ...compareProps(elements.first, elements.second),
            ...compareChildren(elements.first.children, elements.second.children)
        ];
        return changes;
    }

    return changes;
}

/**
 * Compare Tag Names
 * 
 * @param {Object} first 
 * @param {Object} second 
 * 
 * @returns {Array}
 */
function compareTags(first: IElementRepresentation, second: IElementRepresentation) {
    let f: any = first;
    let s: any = second;

    if (typeof first === 'object' && typeof second === 'object') {
        f = first.tag;
        s = second.tag;
    }

    return f !== s
        ? [{ name: 'replacedElement', value: s }]
        : [];
}

/**
 * Compare Props
 * 
 * @param {Object} firstEl 
 * @param {Object} secondEl 
 * 
 * @returns {Array}
 */
function compareProps(firstEl: IElementRepresentation, secondEl: IElementRepresentation) {
    const firstProps = firstEl.props || {};
    const secondProps = secondEl.props || {};
    let changes: IChange[] = [];

    Object.keys(firstProps).forEach((key: any) => {
        if (firstProps[key] !== secondProps[key]) {
            changes = [...changes, { name: 'editAttribute', value: { [key]: secondProps[key] } }];
        }
    })

    return changes;
}

/**
 * Compare Children
 * 
 * @param {Object} oldState 
 * @param {Object} newState 
 * 
 * @returns {Array}
 */
function compareChildren(oldState: IElementRepresentation[], newState: IElementRepresentation[]) {
    const childrens = compareRepresentations(oldState, newState);
    return childrens.length > 0
        ? [{ name: 'loopChanges', value: childrens }]
        : [];
}
