import "reflect-metadata";
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import { bootstrap, createComponent } from "./bootstrap";
import { Component, Attribute, State } from "./decorators";
import { ExFModule } from "./modules";
import { createStyles } from "./styles";
import { addEvent, events, CompareService, EditService, ExF } from "./virualDomBuilder";
import { WorkLoop } from "./workLoop";

export {
    bootstrap,
    createComponent,
    Component,
    Attribute,
    State,
    ExFModule,
    createStyles,
    addEvent,
    events,
    CompareService,
    WorkLoop,
    EditService,
    ExF
}