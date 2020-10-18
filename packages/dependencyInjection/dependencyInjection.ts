import { Ctr } from "../interfaces/interfaces";

// Container with class instances
const container = new Map<string, Ctr<any>>();


/**
 * Resolve Dependecies
 * 
 * @param {Ctr<any>} target
 * 
 * @return {Object} 
 */
export function resolveDependecies(target: Ctr<any>) {
    if (container.has(target.name)) {
        return container.get(target.name);
    }

    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const params = tokens.map(resolveDependecies);

    container.set(target.name, target);

    return new target(...params);
}

/**
 * Bind Dependencies
 * 
 * @param {Ctr<any>} target
 * 
 * @return {Ctr<any>}
 */
export function bindDependencies(target: Ctr<any>) {
    const metadata = Reflect.getMetadata('design:paramtypes', target) || [];
    const params = metadata.map(resolveDependecies);
    const t = target.bind(target, ...params);
    t.prototype = Object.create(target.prototype)

    return t;
}