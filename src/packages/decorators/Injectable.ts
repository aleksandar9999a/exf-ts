import { getServices } from './../modules/Module';

export function Injectable({ selector }: { selector: string }) {
    return function (target: any) {
        Reflect.defineMetadata('component:selector', selector, target);
        return target;
    }
}

export function Inject(selector: string) {
    return function (target: any, key: string) {
        const services = getServices();
        const service = Reflect.getMetadata(selector, services);
        if (!service) { throw new Error(`Service ${selector} is not registered!`) }
        target[key] = service;
        return target;
    }
}