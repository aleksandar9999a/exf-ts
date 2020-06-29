import { Component } from "../../decorators/Component";
import { State } from "../../decorators";

@Component({
    selector: 'exf-router-link',
    template: '<a href="javascript:;" $click="handleClick">${innerHTML}</a>'
})
export class RouterLink {
    to: string | null = null;

    connectedCallback() {
        this.to = (this as any as HTMLElement).getAttribute('to');
    }

    @State
    innerHTML: any;

    handleClick(e: any) {
        e.preventDefault();
        console.log(this.to);
        
        window.history.pushState(null, '', this.to);
        window.dispatchEvent(new Event('locationchange'));
    }

}
