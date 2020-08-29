export interface IElementRepresentation {
    tag: string,
    props: Object,
    children: IElementRepresentation[]
}

export interface IUpdateHTML {
    parent: ChildNode,
    childrens: NodeListOf<ChildNode>,
    changes: any
}

export interface IWorkLoop {
    pushWork: (work: Function) => void;
}

export interface IChange {
    name: string,
    value: any
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
