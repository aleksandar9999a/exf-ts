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
            if (type === "text") {
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

            if (!!oldEl && !!el) {
                let isEdited = false;
                for (let x = 0; x < el.attributes.length; x++) {
                    const newAttr = el.attributes[x];
                    const oldAttr = oldEl.attributes[i];

                    if ((!oldAttr && !!newAttr) || (!!oldAttr && !newAttr) || (oldAttr.name !== newAttr.name || oldAttr.value !== newAttr.value)) {
                        isEdited = true;
                        break;
                    }
                }

                if (el.tag !== oldEl.tag || el.content !== oldEl.content) {
                    isEdited = true;
                }

                if (isEdited) {
                    change.changes.push({ name: 'editElement', value: el });
                    hasChange = true;
                }

                const childrens = this.compareStates(oldEl.childrens, el.childrens);
                if (childrens.length > 0) {
                    change.changes.push({ name: 'loopChanges', value: childrens });
                    hasChange = true;
                }
            } else if (!oldEl && !!el) {
                change.changes.push({ name: 'addElement', value: el });
                hasChange = true;
            } else if (!!oldEl && !el) {
                change.changes.push({ name: 'removeElement', value: oldEl });
            }

            if (hasChange) {
                changes.push(change);
            }
        })

        return changes;
    }

    private editElement(context: any, parent: ChildNode, currEl: ChildNode, newEl: IHTMLRepresentation) {
        const el = this.createDomElement(context, newEl);
        if(!currEl) {
            parent.appendChild(el);
        } else {
            if ((currEl as HTMLElement).tagName !== (el as HTMLElement).tagName) {
                currEl.replaceWith(el);
            } else {
                if(currEl.textContent !== el.textContent) {
                    currEl.textContent = el.textContent;
                }
    
                let currAttrs = (currEl as HTMLElement).attributes;
                let newAttrs = (el as HTMLElement).attributes;
    
                if(!currAttrs || !newAttrs) {
                    return;
                }
    
                for (let i = 0; i < newAttrs.length; i++) {
                    const newAttr = newAttrs[i];
                    const currAttr = currAttrs[i];
    
                    if(newAttr.name !== currAttr.name || newAttr.value !== currAttr.value ) {
                        (currEl as HTMLElement).setAttribute(newAttr.name, newAttr.value);
                    }
                }
            }
        }
    }

    private addElement(context: any, parent: ChildNode, newEl: IHTMLRepresentation) {
        const el = this.createDomElement(context, newEl);
        if (!(parent as HTMLElement).tagName) {
            parent.replaceWith(el);
        } else {
            parent.appendChild(el);
        }
    }

    private removeElement(el: ChildNode) {
        console.log(el);
        
        el.remove();
    }

    updateHTML(parent: ChildNode, childrens: NodeListOf<ChildNode>, map: IElementChange[], context: any) {
        map.forEach(({ index, changes }) => {
            let currEl = childrens[index];

            changes.forEach((({ name, value }: any) => {
                if (name === 'editElement') {
                    this.editElement(context, parent, currEl, value);
                } else if (name === 'addElement') {
                    this.addElement(context, parent, value);
                } else if (name === 'removeElement') {
                    this.removeElement(value);
                } else if (name === 'loopChanges') {
                    this.updateHTML(currEl, currEl.childNodes, value, context);
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
        let state: IHTMLRepresentation[] = [];

        for (let i = 0; i < vDom.length; i++) {
            const element = vDom[i];
            let newEl = Object.assign({}, element);

            newEl.attributes = newEl.attributes.map(attr => {
                let newAttr = Object.assign({}, attr);
                const match = newAttr.name.match(this.attr_reg);
                if (match) { newAttr.value = this.bindedCompileTemplateString(newAttr.value, context); }
                return newAttr;
            })

            if (newEl.content) {
                let content = this.bindedCompileTemplateString(newEl.content, context, true);
                let c = this.createElement('div', content);
                let arr = Array.prototype.slice.call(c.childNodes).filter(c => c.nodeName !== '#text');

                if (arr.length > 0) {
                    let rep = this.createHyperscript(arr as any as NodeListOf<ChildNode>);
                    vDom = [...vDom.slice(0, i), ...rep, ...vDom.slice(i + 1)];
                    newEl = rep[0];
                } else {
                    newEl.content = content;
                }
            }

            if (newEl.childrens.length > 0) {
                newEl.childrens = this.createState(newEl.childrens, context);
            }

            state.push(newEl);
        }

        return state;
    }

    update(context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) {
        const newState = this.createState(vDom, context);
        const changes = this.compareStates(currState, newState);
        return { newState, changes };
    }
}
