import 'reflect-metadata';
import { metakeys } from './metakeys';

/**
 * Define metadate
 *
 * @param {String} metakey
 * @param {Any}    target
 * @param {String} key
 *
 * @return {Void}
 */
function define(metakey: string, target: any, key: string) {
  const data = Reflect.getMetadata(metakey, target) || [];
  Reflect.defineMetadata(metakey, [...data, key], target);
}

/**
 * Find key in metadata
 *
 * @param {String} metakey
 * @param {Any}    target
 * @param {String} key
 *
 * @return {Bool}
 */
function find(metakey: string, target: any, key: string) {
  const data = Reflect.getMetadata(metakey, target, key) || [];
  return data.includes(key);
}

/**
 * Find watched prop if it is registered
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Bool}
 */
export function findWatchedProp(target: any, key: string) {
  return find(metakeys.META_WATCHES, target, key);
}

/**
 * Define prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineProp(target: any, key: string) {
  define(metakeys.META_PROPS, target, key);
}

/**
 * Define prop as state as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineState(target: any, key: string) {
  define(metakeys.META_STATE, target, key);
}

/**
 * Define style prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 *
 * @return {Void}
 */
export function defineStyle(target: any, key: string) {
  define(metakeys.META_STYLE, target, key);
}

/**
 * Define Watched Prop as Metadata
 *
 * @param {Any} target
 * @param {String} key
 * @param {Any} method
 *
 * @return {Void}
 */
export function defineWatch(target: any, key: string, method: any) {
  define(metakeys.META_WATCHES, target, key);
}

/**
 * Find prop if it is registered like state
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findStateProp(target: any, key: string) {
  return find(metakeys.META_STATE, target, key);
}

/**
 * Find prop if it is registered like style
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findStyleProp(target: any, key: string) {
  return find(metakeys.META_STYLE, target, key);
}

/**
 * Find props
 *
 * @param {Any} target
 * @param {String} key
 *
 * @returns {Bool}
 */
export function findProps(target: any, key: string) {
  return find(metakeys.META_PROPS, target, key);
}
