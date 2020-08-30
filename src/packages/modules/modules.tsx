
import { IExFModule } from './../interfaces/interfaces';

const container = {	
    components: {},	
    bootstraps: {}	
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
function createComponent(Ctor: any, innerHTML?: string, bindings?: Object) {  
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
    const container = document.getElementById(id);  
    const instance = createComponent(component);  

    container?.appendChild(instance);  
} 

/**
 * Register components in target
 * 
 * @param  {Object} target
 * @param  {Class} cmp

 * @return {Void}
 */
function register(target: any, cmp: any,) {	
    const selector = Reflect.getMetadata('component:selector', cmp);	
    
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

    (bootstraps || []).forEach(cmp => {
            bootstrap(root, cmp);
    });
}
