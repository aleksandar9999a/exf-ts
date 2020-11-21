import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/custom-elements';
import '@webcomponents/shadydom';
import 'reflect-metadata';

import './polyfills/Node.prototype.remove';
import './polyfills/Node.prototype.replaceWith';
import './polyfills/NodeList.prototype.forEach';

import { CustomElement, Prop, State, Ref, Injectable } from './decorators';
import { IElementRepresentation } from './interfaces/interfaces';
import { ExFModule } from './modules/modules';
import { Component } from './component/Component';

export {
	ExFModule,
	CustomElement,
	Component,
	Prop,
	State,
	Ref,
	Injectable
};

/**
 * ExF - Default JSX Engine
 *
 * @param {String} tag
 * @param {Any} props
 * @param {Array} children
 *
 * @returns {Object}
 */
export default function ExF(tag: string, props: any, ...childs: (string | IElementRepresentation)[]) {
	const children = childs
		.reduce((acc: (string | IElementRepresentation)[], x) => {
			if (x === null) {
				return acc
			}

			if (Array.isArray(x)) {
				return [...acc, ...x]
			}

			acc.push(x)
			return acc
		}, [])

	return {
		tag,
		props: props || {},
		children
	};
}
