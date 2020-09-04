import { defineState, findWatchedProp } from './../metadata/metadata';

/**
 * State Decorator
 *
 * @param {Any} target
 * @param {String} key
 * @param {TypedPropertyDescriptor<any>} descriptor
 *
 * @return {Void}
 */
export function State(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) {
  defineState(target, key);

  if (!!findWatchedProp(target, key)) {
    return;
  }

  if (!!descriptor) {
    const currentMethod = descriptor.value;
    descriptor.value = function (this: any, ...args: any[]) {
      currentMethod(...args);

      if (this.update) {
        this.update();
      }
    };
    return;
  }

  let val: any;

  Object.defineProperty(target, key, {
    set(newValue) {
      val = newValue;

      if (this.update) {
        this.update();
      }
    },
    get() {
      return val;
    },
    configurable: true,
  });
}
