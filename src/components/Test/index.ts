import { Component, State } from "../../packages";


@Component({
    selector: 'exf-test',
    template: '<div><input $input="this.handleInput" /><p>${this.text}</p></div>'
})
export class Test {
    @State
    text = '';

    constructor() {

    }
    
    handleInput(e: any) {
        this.text = e.target.value;
    }
}
