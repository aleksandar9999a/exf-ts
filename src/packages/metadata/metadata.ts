/**
 * Find watched prop if it is registered
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Undefined | Object}
 */
export function findWatchedProp(target: any, key: string) {
	const watches = Reflect.getMetadata('component:watches', target) || [];

	return watches.find((prop: Object) => {
		return Object.keys(prop).includes(key);
	})
}

/**
 * Define prop as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineProp(target: any, key: string) {
	const props = Reflect.getMetadata('component:props', target) || [];
	Reflect.defineMetadata('component:props', [...props, key], target);
}

/**
 * Define prop as state as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineState(target: any, key: string) {
	const states = Reflect.getMetadata('component:states', target) || [];
	Reflect.defineMetadata('component:states', [...states, key], target);
}


/**
 * Define style prop as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineStyle(target: any, key: string) {
	const styles = Reflect.getMetadata('component:style', target) || [];
	Reflect.defineMetadata('component:style', [...styles, key], target);
}

/**
 * Define Watched Prop as Metadata
 * 
 * @param {Any} target
 * @param {String} key
 * @param {Any} method
 *
 * @return {Void}
 */
export function defineWatch(target: any, key: string, method: any) {
		const watches = Reflect.getMetadata('component:watches', target) || [];
		Reflect.defineMetadata('component:watches', [...watches, { [key]: method }], target);
}

/**
 * Find prop if it is registered like state
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findStateProp(target: any, key: string) {
	const states = Reflect.getMetadata('component:states', target) || [];
	return states.includes(key);
}

/**
 * Find prop if it is registered like style
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findStyleProp(target: any, key: string) {
	const style = Reflect.getMetadata('component:style', target) || [];
	return style.includes(key);
}

/**
 * Find props
 * 
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findProps(target: any, key: string) {
	const props = Reflect.getMetadata('component:props', target) || [];
	return props.includes(key);
}
