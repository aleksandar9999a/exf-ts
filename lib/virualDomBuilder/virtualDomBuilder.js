import { events } from './events-register';
/**
 * Parse IElementRepresentation | string to HTML Element
 *
 * @param {IElementRepresentation | string} children
 *
 * @returns {HTMLElement | Text}
 */
function elementParser(child) {
    return typeof child === 'string' ? document.createTextNode(child) : representationParser(child);
}
/**
 * Parse HTML Representation
 *
 * @param {IElementRepresentation} representation
 *
 * @returns {HTMLElement}
 */
export function representationParser(_a) {
    var tag = _a.tag, props = _a.props, children = _a.children;
    return tag.includes('-')
        ? createCustomElement({ tag: tag, props: props, children: children })
        : createIntrinsicElement({ tag: tag, props: props, children: children });
}
/**
 * Create a Custom Web Component - HTML Element
 *
 * @param {IElementRepresentation}
 *
 * @return {HTMLElement}
 */
function createCustomElement(_a) {
    var tag = _a.tag, props = _a.props, children = _a.children;
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
        el.setProps(key, props[key]);
    });
    children.map(elementParser).forEach(function (child) {
        el.appendChild(child);
    });
    return el;
}
/**
 * Create ordinary HTML Element
 *
 * @param {IElementRepresentation}
 *
 * @return {HTMLElement}
 */
function createIntrinsicElement(_a) {
    var tag = _a.tag, props = _a.props, children = _a.children;
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
        if (typeof props[key] === 'function' && !!events[key]) {
            el.addEventListener(events[key], props[key]);
        }
        else if (key === 'style') {
            var styleProps = Object.keys(props[key]);
            styleProps.forEach(function (style) {
                el.style[style] = props[key][style];
            });
        }
        else {
            el[key] = props[key];
        }
    });
    children.map(elementParser).forEach(function (child) {
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
export function extractChanges(childNodes, firstRep, secondRep) {
    return function () {
        return updateHTML({
            parent: childNodes[0],
            childrens: childNodes,
            changes: compareRepresentations([firstRep], [secondRep]),
        });
    };
}
/**
 * Commit changes to ui
 *
 * @param {IUpdateHTML} data
 *
 * @returns {Void}
 */
function updateHTML(_a) {
    var parent = _a.parent, childrens = _a.childrens, changes = _a.changes;
    changes.forEach(function (change) {
        var currEl = childrens[change.elementIndex];
        var propKeys = Object.keys(change.props || {});
        propKeys.forEach(function (key) {
            currEl[key] = change.props[key];
        });
        if (!!change.removeElement) {
            currEl.remove();
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
            change.children.forEach(function (el) {
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
function compareRepresentations(oldState, newState) {
    if (oldState === void 0) { oldState = []; }
    if (newState === void 0) { newState = []; }
    var changes = [];
    oldState.forEach(function (oldEl, i) {
        var newEl = newState[i];
        var change = { elementIndex: i };
        var hasChange = false;
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
        var oldElProps = Object.keys(oldEl.props || {});
        oldElProps.forEach(function (key) {
            var oldProp = oldEl.props[key];
            var newProp = newEl.props[key];
            if (oldProp !== newProp) {
                if (!change.props) {
                    change.props = {};
                }
                change.props[key] = newProp;
                hasChange = true;
            }
        });
        var children = compareRepresentations(oldEl.children, newEl.children);
        if (children.length > 0) {
            change.children = children;
            hasChange = true;
        }
        if (hasChange) {
            changes.push(change);
        }
    });
    if (oldState.length < newState.length) {
        var itemsLeft = newState.slice(oldState.length);
        var change = {
            elementIndex: -1,
            children: itemsLeft,
        };
        changes.push(change);
    }
    return changes;
}
//# sourceMappingURL=virtualDomBuilder.js.map