export function CustomElement({ selector }: { selector: string }) {
    return (target: any) => {
        Object.defineProperty(target.prototype, 'selector', {
            value: selector,
            writable: false,
        });

        customElements.define(selector, target);
        return target;
    };
}
