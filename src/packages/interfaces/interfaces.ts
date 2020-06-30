export interface IComponentDecorator {
    root: ShadowRoot;
    currRepresentation: IHTMLRepresentation[];
    virtualDom: IHTMLRepresentation[];
    realDom: HTMLElement;
    update: () => void;
}

export interface IVirtualDomBuilder {
    createVirtualDom: (html: string) => IHTMLRepresentation[],
    createRealDom: (vDom: IHTMLRepresentation[], context: any) => HTMLElement,
    createState: (vDom: IHTMLRepresentation[], context: any) => IHTMLRepresentation[],
    update: (context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) => IHTMLRepresentation[]
}

export interface IHTMLRepresentation {
    tag: string,
    attributes: { name: string, value: any }[],
    childrens: IHTMLRepresentation[],
    content: string
}

interface IChange {
    name: string,
    value: string | number | Function | IElementChange[] | IChange
}

export interface IElementChange {
    index: number,
    changes: IChange[]
}
