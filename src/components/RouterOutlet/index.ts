import { Component } from "../../packages/decorators";

@Component({
    selector: 'exf-router-outlet',
    template: ''
})
export class RouterOutlet {
    outlet: HTMLElement;
    childrens: Element[] = [];
    default: Element | undefined;

    constructor() {
        this.outlet = (this as any as HTMLElement);
        this.childrens = Array.prototype.slice.call(this.outlet.children);
        this.default = this.childrens.find(child => child.getAttribute('routerLink') === '*');
    }

    connectedCallback() {
        window.addEventListener('locationchange', this.stateChangeHandler.bind(this));
        this.render();
    }

    stateChangeHandler(e: any) {
        e.preventDefault();
        this.render();
    }

    render() {
        const path = window.location.pathname;
        const child = this.childrens.find(child => child.getAttribute('routerLink') === path);
        this.outlet.innerHTML = '';

        if (child) {
            this.outlet.appendChild(child);
        } else if(this.default) {
            this.outlet.appendChild(this.default);
        } else {
            throw new Error('Invalid route link!');
        }
    }

    disconnectedCallback() {
        window.removeEventListener('locationchange', this.stateChangeHandler.bind(this));
    }
}