export interface IComponentDecorator {
    root: ShadowRoot;
    currRepresentation: IHTMLRepresentation[];
    virtualDom: IHTMLRepresentation[];
    realDom: HTMLElement;
    update: () => void;
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
