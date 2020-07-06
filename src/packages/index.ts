import "reflect-metadata";
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { WorkLoop } from "./workLoop/work-loop";
import { VirtualDomBuilder } from "./virualDomBuilder";
import { ExFModule } from "./modules/Module";
export * from './decorators';
export * from './virualDomBuilder';
export * from './workLoop/work-loop';
export * from './modules/Module';

export default ExFModule({
    services: [
        WorkLoop,
        VirtualDomBuilder
    ]
})