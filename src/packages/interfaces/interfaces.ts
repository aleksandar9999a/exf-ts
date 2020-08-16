export interface IComponentDecorator {
    root: ShadowRoot;
    currRepresentation: IHTMLRepresentation[];
    htmlRep: IHTMLRepresentation[];
    realDom: HTMLElement | Text;
    update: () => void;
}

export interface IVirtualDomBuilder {
    createTemplateRepresentation: (html: string) => IHTMLRepresentation[],
    createRealDom: (vDom: IHTMLRepresentation[], context: any) => HTMLElement | Text,
    createState: (vDom: IHTMLRepresentation[], context: any) => IHTMLRepresentation[],
    updateHTML: (arg: IUpdateHTML) => void,
    update: (context: any, vDom: IHTMLRepresentation[], currState: IHTMLRepresentation[]) => { newState: IHTMLRepresentation[], commit: Function }
}

export interface IElementRepresentation {
    tag: string,
    props: Object,
    children: IElementRepresentation[]
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

export interface IComapreService {
    compareAttributes: (firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation) => IChange[],
    compareTags: (first: IHTMLRepresentation, second: IHTMLRepresentation) => { name: string; value: IHTMLRepresentation; }[],
    compareContent: (firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation) => { name: string; value: string | undefined; }[],
    compareChildrens: (oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) => { name: string; value: IElementChange[]; }[],
    compareTwoElements: (firstEl: IHTMLRepresentation, secondEl: IHTMLRepresentation, stateLenght: string) => IChange[],
    compareLength: (oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) => { length: string; shorter: IHTMLRepresentation[]; longer: IHTMLRepresentation[]; },
    compareStates: (oldState: IHTMLRepresentation[], newState: IHTMLRepresentation[]) => IElementChange[]
}

export interface IEditService {
    attachContent: (el: HTMLElement | Text, type: string, content?: any) => void,
    createElement: (type: string, content?: any) => HTMLElement | Text,
    createDomElement: (context: any, element: IHTMLRepresentation) => ChildNode,
    editAttribute: ({ context, element, value }: IMainVDomArguments) => void,
    replacedName: ({ element, value }: IMainVDomArguments) => void,
    replacedElement: ({ context, element, value }: IMainVDomArguments) => void,
    addElement: ({ context, parent, value }: IMainVDomArguments) => void,
    removeElement: ({ element, value }: IMainVDomArguments) => void,
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

export interface IExFModule {
    components?: any[],
    modules?: any[],
    bootstraps?: any[]
}

export interface IModuleContainer {
    components: object,
    bootstraps: object
}
