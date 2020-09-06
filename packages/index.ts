import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { CustomElement, Props, State, Ref, Style } from './decorators';
import { IElementRepresentation } from './interfaces/interfaces';
import { ExFModule } from './modules/modules';
import { Component } from './component/Component';

export { CustomElement, Component, Props, State, Ref, Style, ExFModule };

/**
 * ExF - Default JSX Engine
 *
 * @param {String} tag
 * @param {Any} props
 * @param {Array} children
 *
 * @returns {Object}
 */
export default function ExF(tag: string, props: any, ...children: (string | IElementRepresentation)[]) {
    children = (children as any).flat().filter((child: any) => child !== null) as (string | IElementRepresentation)[];

    return {
        tag,
        props: props || {},
        children,
    };
}