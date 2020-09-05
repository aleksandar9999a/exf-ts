/**
 * Ref Decorator
 *
 * @param  {Object}
 *
 * @return {Function}
 */
export function Ref({ id }: { id: string }): any {
    return (target: any, key: string) => {
        Object.defineProperty(target, key, {
            get() {
                return this._root.getElementById(id);
            },
        });
    };
}
