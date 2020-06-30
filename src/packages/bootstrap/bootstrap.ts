import  module  from "../../Module";
import { createComponent } from "./createComponent";

export function bootstrap(component: any) {
    const container = document.getElementById('app');
    const instance = createComponent(component);
    container?.appendChild(instance);
    module;
}