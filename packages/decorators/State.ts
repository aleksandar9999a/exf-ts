/**
 * State Decorator
 *
 * @param {String} type
 *
 * @return {() => Void}
 */
export function State(type?: string) {
    /**
     *
     * @param {Any} target
     * @param {String} key
     * @param {TypedPropertyDescriptor<any>} descriptor
     *
     * @return {Void}
     */
    return (target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) => {
        Object.defineProperty(target, key, {
            set(newValue) {
                this._state[key] = newValue;

                if (type === 'style' && !!this.stylize) {
                    this.updateStyle();
                } else if (type === 'state') {
                    this.update();
                } else {
                    if (!!this.stylize) {
                        this.updateStyle();
                    }

                    this.update();
                }
            },
            get() {
                return this._state[key];
            },
        });
    };
}
