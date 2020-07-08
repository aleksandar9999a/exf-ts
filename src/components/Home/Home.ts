import template from './template.html';
import { Component, State } from '../../packages';

@Component({
    selector: 'exf-home',
    template
})
export class Home {
    @State list: string[] = [];
    @State test = 'Alex';

    @State text = "";

    handleInput(e: any) {
        this.text = e.target.value;
    }

    handleDelete(e: any) {
        const i = e.target.id;
        this.list = this.list.filter(str => !str.includes(`key="${i}"`));
    }

    handleSubmit() {
        let id = this.list.length;
        this.list.push(`<li key="${id}">${this.text}<button id="${id}" $click='this.handleDelete'>Delete</button></li>`);
        this.text = "";
        
    }
}
