import { IHTMLRepresentation } from "../html/interfaces";

export interface IComponentDecorator {
    root: ShadowRoot;
    currRepresentation: IHTMLRepresentation[];
    virtualDom: IHTMLRepresentation[];
    realDom: HTMLElement;
    update: () => void;
}
