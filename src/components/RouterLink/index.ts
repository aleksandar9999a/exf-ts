import { Component, State } from "../../packages/decorators";

@Component({
    selector: 'exf-router-link',
    template: '<a href="javascript:;" $click="handleClick">${innerHTML}</a>'
})
export class RouterLink {
    to = (this as any as HTMLElement).getAttribute('to');

    handleClick(e: any) {
        e.preventDefault();
        window.history.pushState(null, '', this.to);
        window.dispatchEvent(new Event('locationchange'));
    }

}
