import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/custom-elements';
import '@webcomponents/shadydom';
import 'reflect-metadata';

import './polyfills/Node.prototype.remove';
import './polyfills/Node.prototype.replaceWith';
import './polyfills/NodeList.prototype.forEach';

import {
	CustomElement,
	Prop,
	State,
	Ref,
	Injectable,
	ModuleInjected
} from './decorators';

import { ExFModule } from './modules/modules';
import { Component } from './component/Component';

import { ExF } from './ExF';

export {
	ExFModule,
	CustomElement,
	Component,
	Prop,
	State,
	Ref,
	Injectable,
	ModuleInjected
};

export default ExF;
