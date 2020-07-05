export interface IComponentDecorator {
    root: ShadowRoot;
    currRepresentation: IHTMLRepresentation[];
    virtualDom: IHTMLRepresentation[];
    realDom: HTMLElement | Text;
    update: () => void;
}

export interface IVirtualDomBuilder {
    createTemplateRepresentation: (html: string) => IHTMLRepresentation[],
    createRealDom: (vDom: IHTMLRepresentation[], context: any) => HTMLElement | Text,
    createState: (vDom: IHTMLRepresentation[], context: any) => IHTMLRepresentation[],
    updateHTML: (arg: IUpdateHTML) => void,
    update: (context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) => { newState: IHTMLRepresentation[], changes: IElementChange[] }
}

export interface IUpdateHTML {
    parent: ChildNode,
    childrens: NodeListOf<ChildNode>,
    map: IElementChange[],
    context: any
}

export interface IMainVDomArguments {
    context: any,
    parent?: ChildNode,
    element: ChildNode,
    value: IHTMLRepresentation | IChange | string
}

export interface IWorkLoop {
    pushWork: (work: Function) => void;
}

export interface IHTMLRepresentation {
    tag: string,
    attributes: { name: string, value: any }[],
    childrens: IHTMLRepresentation[],
    content?: string
}

export interface IChange {
    name: string,
    value: any
}

export interface IElementChange {
    index: number,
    changes: IChange[]
}


type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
    timeout: number;
};
type RequestIdleCallbackDeadline = {
    readonly didTimeout: boolean;
    timeRemaining: (() => number);
};

declare global {
    interface Window {
        requestIdleCallback: ((
            callback: ((deadline: RequestIdleCallbackDeadline) => void),
            opts?: RequestIdleCallbackOptions,
        ) => RequestIdleCallbackHandle);
        cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
    }
}

export interface IStyleItem {
    selector: string,
    styles: { [key: string]: string }[]
}
