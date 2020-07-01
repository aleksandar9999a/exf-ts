import template from './template.html';
import { Component } from '../../packages/decorators/Component';
import { IStyleItem } from '../../packages/interfaces/interfaces';

const styles: IStyleItem[] = [
    {
        selector: 'div',
        styles: [
            { 'background': 'green' }
        ]
    },
    {
        selector: '.foo',
        styles: [
            { 'color': 'red' }
        ]
    },
]

@Component({
    selector: 'exf-about',
    template,
    styles
})
export class About {
    
}
