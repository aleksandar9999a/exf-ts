import { CompareService } from "..";
import { WorkLoop } from "../workLoop";

export function workLoopFactory() {
    return new WorkLoop();
}

export function compareServiceFactory() {
    return new CompareService();
}