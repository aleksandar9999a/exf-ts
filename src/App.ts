import { Component } from './packages/decorators/Component';
import template from './App.html';
import { State } from './packages/decorators/State';

@Component({
    selector: 'ex-home',
    template
})
class Home {
    @State
    counter = 0;
    @State
    text = 1;
    @State
    inputValue = 1;

    increase() {
        this.counter++;
    }

    handleChange(e: any) {
        this.text = e.target.value
    }
}
