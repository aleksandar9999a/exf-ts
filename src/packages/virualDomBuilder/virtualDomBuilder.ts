import { IHTMLRepresentation, IVirtualDomBuilder, IUpdateHTML, IComapreService, IEditService } from "./../interfaces/interfaces";
import { compareServiceFactory, editServiceFactory } from "../factories/factories";


export class VirtualDomBuilder implements IVirtualDomBuilder {
    private cService: IComapreService;
    private eService: IEditService;
    private attr_reg = /\$[\w]+/g;

    constructor() {
        this.cService = compareServiceFactory();
        this.eService = editServiceFactory();
    }

    private bindedCompileTemplateString(str: string, context: any, stringify?: boolean) {
        if (stringify) {
            return new Function('return `' + str + '`;').bind(context)();
        } else {
            return new Function('return ' + str + ';').bind(context)();
        }
    }

    private createHyperscript(elements: NodeListOf<ChildNode>): IHTMLRepresentation[] {
        const arr = Array.prototype.slice.call(elements);
        return arr.reduce((acc, currEl) => {
            let currNode: IHTMLRepresentation = { tag: '', attributes: [], childrens: [] };
            currNode.tag = currEl.nodeName;

            const attrs = (currEl as any).attributes as NamedNodeMap;
            if (!!attrs) {
                for (let x = 0; x < attrs.length; x++) {
                    const attr = attrs[x];
                    currNode.attributes.push({ name: attr.name, value: attr.value });
                }
            }

            if (currNode.tag.includes("#") && !!currEl.textContent) { currNode.content = currEl.textContent; }

            const child = this.createHyperscript(currEl.childNodes);
            currNode.childrens = child.filter(c => !((c.tag === '#comment' || c.tag === "#text") && c.content?.trim().length === 0));

            return [...acc.slice(), currNode];
        }, []);
    }

    updateHTML({ parent, childrens, map, context }: IUpdateHTML) {
        map.forEach(({ index, changes }) => {
            let element = childrens[index];
            changes.forEach((({ name, value }: any) => {
                if (typeof (this.eService as any)[name] === 'function') {
                    (this.eService as any)[name]({ context, parent, element, value });
                } else if (name === 'loopChanges') {
                    this.updateHTML({ parent: element, childrens: element.childNodes, map: value, context });
                } else {
                    throw new Error(`Method ${name} is unknown!`);
                }
            }))
        })
    }

    createTemplateRepresentation(html: string): IHTMLRepresentation[] {
        const temp = this.eService.createElement('template', html) as HTMLTemplateElement;
        return this.createHyperscript(temp.content.childNodes);
    }

    createRealDom(vDom: IHTMLRepresentation[], context: any): HTMLElement | Text {
        return this.eService.createDomElement(context, { tag: 'div', attributes: [], childrens: vDom }) as HTMLElement | Text;
    }

    generateAttr(context: any, attr: { name: string, value: any }) {
        let newAttr = { ...attr };
        const match = newAttr.name.match(this.attr_reg);
        if (match) { newAttr.value = this.bindedCompileTemplateString(newAttr.value, context); }
        return newAttr;
    }

    generateElContent(context: any, content: any) {
        let c = this.bindedCompileTemplateString(content, context, true);
        let el = this.eService.createElement('div', c);
        return {
            raw: c,
            childrens: Array.prototype.slice.call(el.childNodes).filter(e => e.nodeName !== '#text')
        }
    }

    createState(vDom: IHTMLRepresentation[], context: any) {
        return vDom.reduce((acc: IHTMLRepresentation[], element) => {
            let newEl = { ...element };
            let newElements: IHTMLRepresentation[] = [];
            newEl.attributes = newEl.attributes.map(this.generateAttr.bind(this, context));

            if (newEl.content) {
                const c = this.generateElContent(context, newEl.content);
                if (c.childrens.length > 0) {
                    const newRep = this.createHyperscript(c.childrens as any as NodeListOf<ChildNode>);
                    newEl = newRep[0];
                    newElements = this.createState(newRep.slice(1), context);
                } else {
                    newEl.content = c.raw;
                }
            }

            if (newEl.childrens.length > 0) {
                newEl.childrens = this.createState(newEl.childrens, context);
            }

            return [...acc.slice(), newEl, ...newElements]
        }, []);
    }

    update(context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) {
        const newState = this.createState(vDom, context);
        const changes = this.cService.compareStates(currState, newState);
        const commit = this.updateHTML.bind(this, {
            parent: context.root.childNodes[0],
            childrens: context.root.children[0].childNodes,
            map: changes,
            context
        })
        return { newState, changes, commit };
    }
}
