export function Attribute(target: any, key: string): any {
    Object.defineProperty(target, key, {
        set(newValue) {
            if(typeof this.setAttribute === 'function') {
                this.setAttribute(key, newValue);
            }

            if (this.update) {
                this.update();
            }
        },
        get() {
            if(typeof this.getAttribute === 'function') {
                return this.getAttribute(key);
            }

            return undefined;
        }
    });
}