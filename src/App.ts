import { Component } from './packages/decorators/Component';
import template from './App.html';
import { State } from './packages';

@Component({
    selector: 'exf-home',
    template
})
export class Home {
    @State
    text = '';
    
    handleInput(e: any) {
        this.text = e.target.value;
    }
}
