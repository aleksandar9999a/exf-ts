import { Component } from '../../packages/decorators/Component';

@Component({
    selector: 'exf-home',
    template: '<div>Home<p>My text is ${["ivan", "pesho"]}</p></div>'
})
export class Home {
    text = "dynamic"
}
