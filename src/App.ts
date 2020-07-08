import template from './App.html';
import { Component, State } from './packages';


@Component({
    selector: 'exf-app',
    template
})
export class App {
    @State clock: string;
    @State text = "";
    @State list: string[] = [];

    constructor() {
        this.clock = new Date().toLocaleTimeString();

        setInterval(() => {
            this.clock = new Date().toLocaleTimeString();
        }, 1000)
    }

    handleInput(e: any) {
        this.text = e.target.value;
    }

    handleDelete(e: any) {
        e.preventDefault();
        const i = e.target.id;
        this.list = this.list.filter(str => !str.includes(`key="${i}"`));
    }

    handleSubmit() {
        let id = Math.floor(Math.random() * 10000);
        this.list.push(`<li key="${id}">${this.text}<button id="${id}" $click='this.handleDelete'>Delete</button></li>`);
        this.text = "";
    }
}
