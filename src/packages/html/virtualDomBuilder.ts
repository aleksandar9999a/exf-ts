import { IHTMLRepresentation, IElementChange } from "./interfaces";
import { events } from "./events-register";

class VirtualDomBuilder {
    private state_reg = /\${\w+}/g;
    private attr_reg = /\$[\w]+/g;

    private createElement(type: string, content?: any): HTMLElement {
        let e = document.createElement(type);
        if (typeof content === "string") {
            e.innerHTML = content;
        }
        if (typeof content === "object") {
            e.appendChild(content);
        }
        return e;
    }

    private createHyperscript(elements: HTMLCollection): IHTMLRepresentation[] {
        let rep: IHTMLRepresentation[] = [];
        for (let i = 0; i < elements.length; i++) {
            let currNode: IHTMLRepresentation = { tag: '', attributes: [], childrens: [], content: '' };
            const currEl = elements[i];
            currNode.tag = currEl!.tagName;

            const attrs = currEl.attributes;
            if (attrs.length > 0) {
                for (let x = 0; x < attrs.length; x++) {
                    const attr = attrs[x];
                    currNode.attributes.push({ name: attr.name, value: attr.value });
                }
            }

            const childNodes = currEl.childNodes;
            if (childNodes.length > 0) {
                childNodes.forEach(el => {
                    if (el.nodeName === '#text' && !!el.nodeValue) {
                        currNode.content = el.nodeValue;
                    }
                })

                const child = this.createHyperscript(currEl.children);
                currNode.childrens = child;
            }

            rep.push(currNode);
        }
        return rep;
    }

    private createDomElement(context: any, { tag, attributes, childrens, content }: IHTMLRepresentation) {
        const el = this.createElement(tag, content);

        attributes.forEach(({ name, value }) => {
            const match = name.match(this.attr_reg);
            if (match) {
                const attr = name.slice(1);
                if (typeof value === 'function' && events[attr]) {
                    el.addEventListener(attr, value.bind(context));
                } else {
                    el.setAttribute(attr, value);
                }
            } else {
                el.setAttribute(name, value);
            }
        })

        childrens.map(this.createDomElement.bind(this, context)).forEach(child => el.appendChild(child));

        return el;
    }

    private compareStates(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[], context: any) {
        let changes: IElementChange[] = [];
        newState.forEach((el, i) => {
            const oldEl = oldState[i];
            let hasChange = false
            let change: IElementChange = { index: i, changes: [] };

            if (el.tag !== oldEl.tag) {
                change.changes.push({ name: 'tag', value: el.tag });
                hasChange = true;
            }

            if (el.content !== oldEl.content) {
                change.changes.push({ name: 'content', value: el.content });
                hasChange = true;
            }

            el.attributes.forEach(({ name, value }, i) => {
                const oldAttr = oldEl.attributes[i];
                if (oldAttr.name !== name || oldAttr.value !== value) {
                    change.changes.push({ name: 'attributes', value: { name, value } });
                    hasChange = true;
                }
            })

            const childrens = this.compareStates(oldEl.childrens, el.childrens, context);
            if (childrens.length > 0) {
                change.changes.push({ name: 'childrens', value: childrens });
                hasChange = true;
            }

            if (hasChange) {
                changes.push(change);
            }
        })

        return changes;
    }

    private updateHTML(childrens: HTMLCollection, map: IElementChange[]) {
        map.forEach(({ index, changes }) => {
            const currEl = childrens[index];

            changes.forEach((({ name, value }: any) => {
                if (name === 'tag') {
                    const newE = this.createElement(value);
                    currEl.replaceWith(newE);
                } else if (name === 'attributes') {
                    let name = value.name;
                    if (name.match(this.attr_reg)) {
                        name = name.slice(1);
                    }
                    currEl.setAttribute(name, value.value);
                } else if (name === 'content') {
                    currEl.innerHTML = value;
                } else if (name === 'childrens') {
                    this.updateHTML(currEl.children, value);
                }
            }))
        })
    }

    createVirtualDom(html: string): IHTMLRepresentation[] {
        const temp = this.createElement('template', html) as HTMLTemplateElement;
        const vDom = this.createHyperscript(temp.content.children);
        return vDom;
    }

    createRealDom(vDom: IHTMLRepresentation[], context: any) {
        return this.createDomElement(context, { tag: 'div', attributes: [], childrens: vDom, content: '' })
    }

    createState(vDom: IHTMLRepresentation[], context: any) {
        return vDom.map(element => {
            let newEl = Object.assign({}, element);

            newEl.attributes = newEl.attributes.map(attr => {
                let newAttr = Object.assign({}, attr);
                const match = newAttr.name.match(this.attr_reg);

                if (match) {
                    if (context[newAttr.value] !== undefined) {
                        newAttr.value = context[newAttr.value];
                    }
                }

                return newAttr;
            })

            let text = newEl.content;
            let textMatch = text.match(this.state_reg);

            if (textMatch) {
                textMatch.forEach(match => {
                    const index = text.indexOf(match);
                    let realText = match.slice(2, match.length - 1);
                    if (context[realText] !== undefined) {
                        text = text.slice(0, index) + context[realText] + text.slice(index + match.length);
                    }
                })
            }

            newEl.content = text;

            if (newEl.childrens.length > 0) {
                newEl.childrens = this.createState.bind(this)(newEl.childrens, context);
            }

            return newEl;
        })
    }

    update(context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) {
        const newState = this.createState(vDom, context);
        const changes = this.compareStates(currState, newState, context);
        const childrens = (context.root as ShadowRoot).children[0].children;
        this.updateHTML(childrens, changes);
        return newState;
    }
}

export default new VirtualDomBuilder();