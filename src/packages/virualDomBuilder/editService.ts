import { events } from "..";
import { IMainVDomArguments, IChange, IHTMLRepresentation, IEditService } from "../interfaces/interfaces";

export class EditService implements IEditService {
    private attr_reg = /\$[\w]+/g;

    attachContent(el: HTMLElement | Text, type: string, content?: any) {
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

    createElement(type: string, content?: any): HTMLElement | Text {
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

    createDomElement(context: any, element: IHTMLRepresentation) {
        const { tag, attributes, childrens, content } = element;
        const el = this.createElement(tag, content) as ChildNode;
        attributes.forEach(value => this.editAttribute({ context, element: el, value }));
        childrens.map(this.createDomElement.bind(this, context)).forEach(child => el.appendChild(child));
        return el;
    }

    editAttribute({ context, element, value }: IMainVDomArguments) {
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

    replacedName({ element, value }: IMainVDomArguments) {
        element.textContent = value as string;
    }

    replacedElement({ context, element, value }: IMainVDomArguments) {
        const e = this.createDomElement(context, value as IHTMLRepresentation);
        element.replaceWith(e);
    }

    addElement({ context, parent, value }: IMainVDomArguments) {
        const el = this.createDomElement(context, value as IHTMLRepresentation);
        if (!(parent as HTMLElement).tagName) {
            parent!.replaceWith(el);
        } else {
            parent!.appendChild(el);
        }
    }

    removeElement({ element, value }: IMainVDomArguments) {
        const currKey = (element as HTMLElement).attributes.getNamedItem('key');
        if (!currKey) {
            console.error('It is requared to set key attribute!');
        } else if (currKey.value !== (value as IChange).value) {
            throw new Error("Current element key is different from provided!"); 7
        }

        element.remove();
    }
}
