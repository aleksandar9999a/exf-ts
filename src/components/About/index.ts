import template from './template.html';
import { IStyleItem } from '../../packages/interfaces/interfaces';
import { Component } from '../../packages';

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
