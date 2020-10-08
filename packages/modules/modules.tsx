import { IExFModule } from './../interfaces/interfaces';

const container = {	
	components: {},	
	bootstraps: {}	
}

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
 * Create Component
 * 
 * @param  {Class} Ctor
 * @param  {String} innerHTML
 * @param  {Object} bindings
 * 
 * @return {Object}
 */
function createComponent(Ctor: any, innerHTML?: string, bindings?: object) {  
	const instance = new Ctor();  

	instance.textContent = innerHTML;  

	Object.entries(bindings || {}).forEach(([key, value]) => {  
		instance[key] = value;  
	});  

	return instance;  
} 

/**
 * Bootstrap
 * 
 * @param  {String} id
 * @param  {Object} component
 * 
 * @return {Void}
 */
function bootstrap(id: string, component: any) {  
	const root = document.getElementById(id);  
	const instance = createComponent(component);  

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
 * Create module with components
 * 
 * @param {IExfModule}
 *
 * @returns {Void}
 */
export function ExFModule({ components, modules, bootstraps, root }: IExFModule) {	
	(components || []).forEach(cmp => {
		register(container.components, cmp);
	});

	(modules || []).forEach(ExFModule); 
	
	if(!! root) {
		(bootstraps || []).forEach(cmp => {
			bootstrap(root, cmp);
		});
	}
}
