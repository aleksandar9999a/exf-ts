import { Component, Attribute } from "../../packages/decorators";

@Component({
    selector: 'exf-router-link',
    template: '<a href="javascript:;" $click="handleClick">${routename}</a>'
})
export class RouterLink {
    @Attribute to!: string;
    routename: string;

    constructor() {
        this.routename = (this as any).innerHTML;
        (this as any).innerHTML= '';
    }

    handleClick(e: any) {
        e.preventDefault();
        window.history.pushState(null, '', this.to);
        window.dispatchEvent(new Event('locationchange'));
    }

}
