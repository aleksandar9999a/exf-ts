import { IHTMLRepresentation, IElementChange, IVirtualDomBuilder, IChange, IWorkLoop, IUpdateHTML, IMainVDomArguments } from "./../interfaces/interfaces";
import { events } from "./events-register";
import { Injectable } from "../decorators";

function comments(c: IHTMLRepresentation) {
    return c.tag !== '#comment'
}

function emptyText(c: IHTMLRepresentation) {
    return !(c.tag === "#text" && c.content?.trim().length === 0);
}

function filterElements(c: IHTMLRepresentation) {
    return comments(c) || emptyText(c);
}

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

            if (currNode.tag.includes("#") && !!currEl.textContent) { currNode.content = currEl.textContent; }

            const child = this.createHyperscript(currEl.childNodes);
            currNode.childrens = child.filter(filterElements);

            rep.push(currNode);
        }
        return rep;
    }

    private createDomElement(context: any, element: IHTMLRepresentation) {
        const { tag, attributes, childrens, content } = element;
        const el = this.createElement(tag, content) as ChildNode;
        attributes.forEach(value => this.editAttribute({ context, element: el, value }));
        childrens.map(this.createDomElement.bind(this, context)).forEach(child => el.appendChild(child));
        return el;
    }

    private compareAttributes(firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation) {
        const firstAttrs = firstEl.attributes;
        const secondAttrs = secondEl.attributes;
        let changes: IChange[] = [];

        firstAttrs.forEach(currAttr => {
            const findedAttr = secondAttrs.find(attr => attr.name === currAttr.name);
            if (findedAttr && findedAttr.value !== currAttr.value) {
                if (currAttr.name === 'key') {
                    changes = [...changes, { name: 'replacedElement', value: secondEl }]
                } else {
                    changes = [...changes, { name: 'editAttribute', value: findedAttr }];
                }
            }
        })

        return changes;
    }

    private compareTags(first: IHTMLRepresentation, second: IHTMLRepresentation) {
        return first.tag !== second.tag ? [{ name: 'replacedElement', value: second }] : [];
    }

    private compareContent(firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation) {
        return firstEl.content !== secondEl.content ? [{ name: 'replacedName', value: secondEl.content }] : [];
    }

    private compareChildrens(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
        let childrens = this.compareStates(oldState, newState);
        return childrens.length > 0 ? [{ name: 'loopChanges', value: childrens }] : [];
    }

    private compareTwoElements(firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation, stateLenght: string) {
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

        if (!!elements.first && !elements.second && stateLenght === 'oldState') {
            const key = elements.first.attributes.find(attr => attr.name === 'key')
            changes = [...changes, { name: 'removeElement', value: key }];
            return changes;
        }

        if (!!elements.first && !!elements.second) {
            const tags = this.compareTags(elements.first, elements.second)
            changes = [...changes, ...tags];
            if (tags.length > 0) { return changes; }
        }

        if (!!elements.first && !!elements.second) {
            changes = [
                ...changes,
                ...this.compareAttributes(elements.first, elements.second),
                ...this.compareContent(elements.first, elements.second),
                ...this.compareChildrens(elements.first.childrens, elements.second.childrens)
            ];
            return changes;
        }

        return changes;
    }

    private compareLength(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
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

    private compareStates(oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) {
        let changes: IElementChange[] = [];
        let state = this.compareLength(oldState, newState);

        state.longer.forEach((el, i) => {
            const revEl = state.shorter[i];
            let change: IElementChange = { index: i, changes: this.compareTwoElements(revEl, el, state.length) };
            if (change.changes.length > 0) { changes = [...changes, change]; }
        })

        return changes;
    }

    private editAttribute({ context, element, value }: IMainVDomArguments) {
        const match = (value as IChange).name.match(this.attr_reg);

        if (match) {
            const attr = (value as IChange).name.slice(1);
            if (typeof (value as IChange).value === 'function' && events[attr]) {
                element.addEventListener(attr, (value as IChange).value.bind(context));
            } else {
                (element as HTMLElement).setAttribute(attr, (value as IChange).value);
            }
        } else {
            (element as HTMLElement).setAttribute((value as IChange).name, (value as IChange).value);
        }
    }

    private replacedName({ element, value }: IMainVDomArguments) {
        element.textContent = value as string;
    }

    private replacedElement({ context, element, value }: IMainVDomArguments) {
        const e = this.createDomElement(context, value as IHTMLRepresentation);
        element.replaceWith(e);
    }

    private addElement({ context, parent, value }: IMainVDomArguments) {
        const el = this.createDomElement(context, value as IHTMLRepresentation);
        if (!(parent as HTMLElement).tagName) {
            parent!.replaceWith(el);
        } else {
            parent!.appendChild(el);
        }
    }

    private removeElement({ element, value }: IMainVDomArguments) {
        const currKey = (element as HTMLElement).attributes.getNamedItem('key');
        if (!currKey) {
            console.error('It is requared to set key attribute!');
        } else if (currKey.value !== (value as IChange).value) {
            throw new Error("Current element key is different from provided!"); 7
        }

        element.remove();
    }

    updateHTML({ parent, childrens, map, context }: IUpdateHTML) {
        map.forEach(({ index, changes }) => {
            let element = childrens[index];
            changes.forEach((({ name, value }: any) => {
                if (typeof (this as any)[name] === 'function') {
                    (this as any)[name]({ context, parent, element, value });
                } else if (name === 'loopChanges') {
                    this.updateHTML({ parent: element, childrens: element.childNodes, map: value, context });
                } else {
                    throw new Error(`Method ${name} is unknown!`);
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
        return this.createDomElement(context, { tag: 'div', attributes: [], childrens: vDom }) as HTMLElement | Text;
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
