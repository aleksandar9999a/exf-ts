export function createComponent(Ctor: any, innerHTML?: any, bindings?: any) {
    const instance = new Ctor();

    instance.textContent = innerHTML;
    Object.entries(bindings || {}).forEach(([key, value]) => {
        instance[key] = value;
    });

    return instance;
}