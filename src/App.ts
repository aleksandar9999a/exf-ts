import { Component } from './packages/decorators/Component';
import template from './App.html';
import { Prop } from './packages/decorators/Prop';

@Component({
    selector: 'ex-home',
    template
})
class Home {
    @Prop
    counter = 0;

    increase() {
        this.counter++;
    }
}