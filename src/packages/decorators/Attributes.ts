export function Attribute(target: any, key: string): any {
    let attributes = Reflect.getOwnMetadata('component:attributes', target) || [];
    Reflect.defineMetadata('component:attributes', attributes.concat(key), target);
}