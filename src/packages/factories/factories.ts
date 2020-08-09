import {  EditService, CompareService } from "..";
import { WorkLoop } from "../workLoop";

export function workLoopFactory() {
    return new WorkLoop();
}

export function editServiceFactory() {
    return new EditService();
}

export function compareServiceFactory() {
    return new CompareService();
}