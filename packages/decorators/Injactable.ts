import { bindDependencies } from "../dependencyInjection/dependencyInjection"

/**
 * Injectable Decorator
 */
export function Injectable() {
    return (target: any) => {
        return bindDependencies(target);
    }
}