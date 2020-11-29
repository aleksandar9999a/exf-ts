export interface IElementRepresentation {
	tag: string;
	props: object;
	children: IElementRepresentation[];
	element?: HTMLElement | null
}

export interface ICustomElement {
	selector: string,
	dependencyInjection?: boolean,
	shadowMode?: 'open' | 'closed'
}

export interface IExFModule {
	components?: any[];
	modules?: IExFModule[];
	bootstraps?: any[];
	root?: string;
	services?: any[],
	inject?: { [key: string]: any }
}

export interface Ctr<T> { new(...args: any[]): T; }

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

type RequestIdleCallbackHandle = any;

type RequestIdleCallbackOptions = {
	timeout: number;
};

type RequestIdleCallbackDeadline = {
	readonly didTimeout: boolean;
	timeRemaining: () => number;
};

declare global {
	interface Window {
		requestIdleCallback: (
			callback: (deadline: RequestIdleCallbackDeadline) => void,
			opts?: RequestIdleCallbackOptions,
		) => RequestIdleCallbackHandle;
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

export interface IInject {
  key?: string
}
