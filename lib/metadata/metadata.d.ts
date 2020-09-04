import 'reflect-metadata';
/**
 * Find watched prop if it is registered
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Bool}
 */
export declare function findWatchedProp(target: any, key: string): any;
/**
 * Define prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export declare function defineProp(target: any, key: string): void;
/**
 * Define prop as state as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export declare function defineState(target: any, key: string): void;
/**
 * Define style prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export declare function defineStyle(target: any, key: string): void;
/**
 * Define Watched Prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 * @param {Any} method
 *
 * @return {Void}
 */
export declare function defineWatch(target: any, key: string, method: any): void;
/**
 * Find prop if it is registered like state
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export declare function findStateProp(target: any, key: string): any;
/**
 * Find prop if it is registered like style
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export declare function findStyleProp(target: any, key: string): any;
/**
 * Find props
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export declare function findProps(target: any, key: string): any;
