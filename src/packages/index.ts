import "reflect-metadata";
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { bootstrap, createComponent } from "./bootstrap";
import { Injectable, Inject, Component, Attribute, State } from "./decorators";
import { ExFModule, getServices } from "./modules";
import { createStyles } from "./styles";
import { addEvent, events, CompareService, VirtualDomBuilder, EditService } from "./virualDomBuilder";
import { WorkLoop } from "./workLoop";

export {
    bootstrap, 
    createComponent,
    Injectable, 
    Inject, 
    Component, 
    Attribute, 
    State,
    ExFModule, 
    getServices,
    createStyles,
    addEvent, 
    events, 
    CompareService, 
    VirtualDomBuilder,
    WorkLoop,
    EditService
}