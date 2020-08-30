import "reflect-metadata";
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { Component, Attribute, State } from "./decorators";
import { IElementRepresentation } from "./interfaces/interfaces";
import { ExFModule } from "./modules/modules";

export {
    Component,
    Attribute,
    State,
    ExFModule
}

/**
 * ExF - Default JSX Engine
 * 
 * @param {String} tag 
 * @param {Any} props 
 * @param {Array} children 
 * 
 * @returns {Object}
 */
export default function ExF(tag: string | Function, props: any, ...children: (string | IElementRepresentation)[]) {
    children = (children as any)
    	.flat()
    	.filter((child: any) => child !== null) as (string | IElementRepresentation)[];

    return {
    	tag, 
    	props: props || {}, 
    	children 
    };
}
