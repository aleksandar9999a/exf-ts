import  module  from "../../Module";
import { createComponent } from "./createComponent";

export function bootstrap(component: any, id: string) {
    const container = document.getElementById(id);
    const instance = createComponent(component);
    container?.appendChild(instance);
    module;
}