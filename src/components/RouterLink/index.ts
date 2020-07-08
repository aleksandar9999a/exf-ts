import { Component, Attribute, State } from "../../packages";

@Component({
    selector: 'exf-router-link',
    template: '<a href="javascript:;" $click="this.handleClick">${this.innerHTML}</a>'
})
export class RouterLink {
    @Attribute to!: string;
    @State name!: string;

    connectedCallback() {
        this.name = (this as any).innerHTML;
    }

    handleClick(e: any) {
        e.preventDefault();
        window.history.pushState(null, '', this.to);
        window.dispatchEvent(new Event('locationchange'));
    }

}
