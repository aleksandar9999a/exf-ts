import { Component, Attribute } from "../../packages/decorators";

@Component({
    selector: 'exf-router-link',
    template: '<a href="javascript:;" $click="handleClick">${innerHTML}</a>'
})
export class RouterLink {
    @Attribute to!: string;

    handleClick(e: any) {
        e.preventDefault();
        window.history.pushState(null, '', this.to);
        window.dispatchEvent(new Event('locationchange'));
    }

}
