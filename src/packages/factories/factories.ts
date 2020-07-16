import { VirtualDomBuilder, EditService, CompareService } from "..";
import { WorkLoop } from "../workLoop";

export function vDomBuilderFactory() {
    return new VirtualDomBuilder();
}

export function workLoopFactory() {
    return new WorkLoop();
}

export function editServiceFactory() {
    return new EditService();
}

export function compareServiceFactory() {
    return new CompareService();
}