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
            currNode.childrens = child.filter(c => !((c.tag === '#comment' || c.tag === "#text") && c.content?.trim().length === 0));

            rep.push(currNode);
        }
        return rep;
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
        const vDom = this.createHyperscript(temp.content.childNodes);
        return vDom;
    }

    createRealDom(vDom: IHTMLRepresentation[], context: any): HTMLElement | Text {
        return this.eService.createDomElement(context, { tag: 'div', attributes: [], childrens: vDom }) as HTMLElement | Text;
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
                let c = this.eService.createElement('div', content);
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
        const changes = this.cService.compareStates(currState, newState);
        return { newState, changes };
    }
}
