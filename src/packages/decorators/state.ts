export function state(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) {
    if (!!descriptor) {
        const currentMethod = descriptor.value;
        descriptor.value = function (this: any, ...args: any[]) {
            currentMethod(...args);
            if (this.update) { this.update(); }
        }
        return;
    }

    let val: any;

    Object.defineProperty(target, key, {
        set(newValue) {
            val = newValue;
            if (this.update) { this.update(); }
        },
        get() {
            return val;
        }
    });
}