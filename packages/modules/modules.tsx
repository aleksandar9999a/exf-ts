import { IExFModule } from './../interfaces/interfaces';

const container = {	
	components: {},	
	bootstraps: {},
	styles: [],
	injected: {} as { [key: string]: any }
}

let cachedStyles: any;

/**
 * Check is element exist in container
 * 
 * @param {String} selector 
 * 
 * @return {Boolean}
 */
export function isExistElement(selector: string) {
	return !!(container as any).components[selector];
}

/**
 * Get Global Styles
 * 
 * @returns {string[] | object[]}
 */
export function getGlobalStyles() {
	if (cachedStyles) {
		return cachedStyles;
	}

	cachedStyles = container.styles
		.reduce((acc: any, style) => {
			if (typeof style === 'string') {
				const el = { tag: 'style', props: {}, children: [style] }
				acc.push(el);
			} else {
				const children = Object.keys(style)
					.reduce((children: any, key) => {
						children.push(key);
						children.push(style[key]);

						return children
					}, [])

				const el = { tag: 'style', props: {}, children }
				acc.push(el);
			}

			return acc;
		}, [])

	return cachedStyles;
}

/**
 * Get injected
 * 
 * @param {String} key
 * 
 * @returns {Any} 
 */
export function getGlobalInjected(key: string) {
	return container.injected[key];
}

/**
 * Bootstrap
 * 
 * @param  {String} id
 * @param  {Object} component
 * 
 * @return {Void}
 */
function bootstrap(id: string, Ctor: any) {  
	const root = document.getElementById(id);  
	const instance = new Ctor();  

	root?.appendChild(instance);  
} 

/**
 * Register components in target
 * 
 * @param  {Object} target
 * @param  {Class} cmp
 *
 * @return {Void}
 */
function register(target: any, cmp: any) {
	const selector = cmp.prototype.selector;
	
	if (target[selector]) {	
		throw new Error(`Component ${selector} is already registered!`);	
	}
	
	target[selector] = cmp;	
}

/**
 * Register injected
 * 
 * @param {Object | undefined} inject 
 * 
 * @returns {Object}
 */
function registerInjected(inject: Object = {}) {
	container.injected = {
		...container.injected,
		...inject
	}

	return container;
}

/**
 * Register style
 * 
 * @param {string[] | Object[]} target
 * @param {string | Object} style
 * 
 * @returns {string[] | Object[]} 
 */
function registerStyle(target: string[] | Object[], style: string | Object) {
	if (typeof style === 'string' && target.includes(style)) {
		return target
	}

	target.push(style as any)
}

/**
 * Create module with components
 * 
 * @param {IExfModule}
 *
 * @returns {Void}
 */
export function ExFModule({ components, modules, bootstraps, root, inject, styles }: IExFModule) {	
	registerInjected(inject);

	(components || []).forEach(cmp => {
		register(container.components, cmp);
	});

	(styles || []).forEach((style: string | Object) => {
		registerStyle(container.styles, style)
	});

	(modules || []).forEach(ExFModule); 
	
	if(!! root) {
		(bootstraps || []).forEach(cmp => {
			bootstrap(root, cmp);
		});
	}
}
