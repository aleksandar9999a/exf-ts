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

    const service = new target(...params);
    container.set(target.name, service);

    return service;
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

    return class extends target {
        constructor() {
            super(...params)
        }
    } as any
}