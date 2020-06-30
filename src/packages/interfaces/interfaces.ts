export interface IComponentDecorator {
    // root: ShadowRoot;
    currRepresentation: IHTMLRepresentation[];
    virtualDom: IHTMLRepresentation[];
    realDom: HTMLElement;
    update: () => void;
}

export interface IVirtualDomBuilder {
    createVirtualDom: (html: string) => IHTMLRepresentation[],
    createRealDom: (vDom: IHTMLRepresentation[], context: any) => HTMLElement,
    createState: (vDom: IHTMLRepresentation[], context: any) => IHTMLRepresentation[],
    updateHTML: (childrens: HTMLCollection, map: IElementChange[]) => void,
    update: (context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) => { newState: IHTMLRepresentation[], changes: IElementChange[] }
}

export interface IWorkLoop {
    pushWork: (work: Function) => void;
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
