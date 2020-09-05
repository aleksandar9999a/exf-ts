export interface IElementRepresentation {
    tag: string;
    props: object;
    children: IElementRepresentation[];
}
export interface IUpdateHTML {
    parent: ChildNode;
    childrens: NodeListOf<ChildNode>;
    changes: any;
}
export interface IExFModule {
    components?: any[];
    modules?: IExFModule[];
    bootstraps?: any[];
    root?: string;
}
export interface Props {
    [key: string]: any;
}
export interface ICtorStyle {
    styles: HTMLElement[];
    content: string[];
}
export interface ICtorStyleChange {
    element: HTMLElement;
    content: string;
}
export interface State {
    [key: string]: any;
}
export interface Styles {
    [key: string]: any;
}
declare type RequestIdleCallbackHandle = any;
declare type RequestIdleCallbackOptions = {
    timeout: number;
};
declare type RequestIdleCallbackDeadline = {
    readonly didTimeout: boolean;
    timeRemaining: () => number;
};
declare global {
    interface Window {
        requestIdleCallback: (callback: (deadline: RequestIdleCallbackDeadline) => void, opts?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle;
        cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
    }
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}
export {};
