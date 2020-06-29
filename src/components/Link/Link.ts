import { Component } from "../../packages/decorators/Component";

@Component({
    selector: 'exf-link',
    template: '<a href="javascript:;" $click="handleClick">${innerHTML}</a>'
})
export class Link {
    link = (this as any as HTMLElement).getAttribute('link');

    handleClick(e: any) {
        e.preventDefault();
        window.history.pushState(null, '', this.link);
        window.dispatchEvent(new Event('locationchange'));
    }

}
