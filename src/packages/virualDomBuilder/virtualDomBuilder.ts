import { IHTMLRepresentation, IElementChange, IVirtualDomBuilder } from "./../interfaces/interfaces";
import { events } from "./events-register";
import { Injectable } from "../decorators";

@Injectable({ selector: 'VirtualDomBuilder' })
export class VirtualDomBuilder implements IVirtualDomBuilder {
    private attr_reg = /\$[\w]+/g;

    private bindedCompileTemplateString(str: string, context: any, stringify?: boolean) {
        if (stringify) {
            return new Function('return `' + str + '`;').bind(context)();
        } else {
            return new Function('return ' + str + ';').bind(context)();
        }
    }

    private attachContent(el: HTMLElement | Text, type: string, content?: any) {
        if (typeof content === "string") {
            if(type === "text") {
                el.textContent = content;
            } else if (type === "element") {
                (el as HTMLElement).innerHTML = content;
            }
        }
        if (Array.isArray(content)) {
            content.forEach(c => this.attachContent(el, c));
        }
        if (typeof content === "object") {
            el.appendChild(content);
        }
    }

    private createElement(type: string, content?: any): HTMLElement | Text {
        let e: HTMLElement | Text;
        let t = 'element';
        if (type.includes("#")) {
            e = document.createTextNode(content);
            t = 'text';
        } else {
            e = document.createElement(type);
        }
        this.attachContent(e, t, content);
        return e;
    }

    private createHyperscript(elements: NodeListOf<ChildNode>): IHTMLRepresentation[] {
        let rep: IHTMLRepresentation[] = [];
        for (let i = 0; i < elements.length; i++) {
            let currNode: IHTMLRepresentation = { tag: '', attributes: [], childrens: [] };
            const currEl = elements[i];
            currNode.tag = currEl.nodeName;

            const attrs = (currEl as any).attributes as NamedNodeMap;
            if (currNode.tag !== "#text" && !!attrs) {
                for (let x = 0; x < attrs.length; x++) {
                    const attr = attrs[x];
                    currNode.attributes.push({ name: attr.name, value: attr.value });
                }
            }

            if (currNode.tag.includes("#")) {
                currNode.content = currEl.textContent as string;
            }

            const child = this.createHyperscript(currEl.childNodes);
            currNode.childrens = child.filter(c => c.tag !== '#comment').filter(c => !(c.tag === "#text" && c.content?.trim().length === 0));

            rep.push(currNode);
        }
        return rep;
    }

    private createDomElement(context: any, element: IHTMLRepresentation) {
        const { tag, attributes, childrens, content } = element;
        const el = this.createElement(tag, content);

        attributes.forEach(({ name, value }) => {
            const match = name.match(this.attr_reg);
            if (match) {
                const attr = name.slice(1);
                if (typeof value === 'function' && events[attr]) {
                    el.addEventListener(attr, value.bind(context));
                } else {
                    (el as HTMLElement).setAttribute(attr, value);
                }
            } else {
                (el as HTMLElement).setAttribute(name, value);
            }
        })

        childrens.map(this.createDomElement.bind(this, context)).forEach(child => el.appendChild(child));
        return el;
    }

    private compareStates(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
        let changes: IElementChange[] = [];
        newState.forEach((el, i) => {
            const oldEl = oldState[i];
            let hasChange = false
            let change: IElementChange = { index: i, changes: [] };

            if (el.tag !== oldEl.tag) {
                change.changes.push({ name: 'tag', value: el.tag });
                hasChange = true;
            }

            if(el.content !== oldEl.content) {
                change.changes.push({ name: 'content', value: el.content as string})
                hasChange = true;
            }

            el.attributes.forEach(({ name, value }, i) => {
                const oldAttr = oldEl.attributes[i];
                if (oldAttr.name !== name || oldAttr.value !== value) {
                    change.changes.push({ name: 'attributes', value: { name, value } });
                    hasChange = true;
                }
            })

            const childrens = this.compareStates(oldEl.childrens, el.childrens);
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

    updateHTML(childrens: NodeListOf<ChildNode>, map: IElementChange[]) {
        map.forEach(({ index, changes }) => {
            let currEl = childrens[index];

            changes.forEach((({ name, value }: any) => {
                if (name === 'tag') {
                    const newE = this.createElement(value);
                    currEl.replaceWith(newE);
                } else if (name === 'attributes') {
                    let name = value.name;
                    if (name.match(this.attr_reg)) {
                        name = name.slice(1);
                    }
                    (currEl as HTMLElement).setAttribute(name, value.value);
                } else if (name === 'childrens') {
                    this.updateHTML(currEl.childNodes, value);
                } else if (name === 'content') {
                    currEl.textContent = value;
                }
            }))
        })
    }

    createTemplateRepresentation(html: string): IHTMLRepresentation[] {
        const temp = this.createElement('template', html) as HTMLTemplateElement;
        const vDom = this.createHyperscript(temp.content.childNodes);
        return vDom;
    }

    createRealDom(vDom: IHTMLRepresentation[], context: any): HTMLElement | Text {
        return this.createDomElement(context, { tag: 'div', attributes: [], childrens: vDom })
    }

    createState(vDom: IHTMLRepresentation[], context: any) {
        return vDom.map(element => {
            let newEl = Object.assign({}, element);
            newEl.attributes = newEl.attributes.map(attr => {
                let newAttr = Object.assign({}, attr);
                const match = newAttr.name.match(this.attr_reg);

                if (match) {
                    newAttr.value = this.bindedCompileTemplateString(newAttr.value, context);
                }

                return newAttr;
            })

            if(newEl.content) {
                newEl.content = this.bindedCompileTemplateString(newEl.content, context, true);
            }

            if (newEl.childrens.length > 0) {
                newEl.childrens = this.createState(newEl.childrens, context);
            }
            return newEl;
        })
    }

    update(context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) {
        const newState = this.createState(vDom, context);
        const changes = this.compareStates(currState, newState);
        return { newState, changes };
    }
}
