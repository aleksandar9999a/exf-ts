const props_reg = /\${\w+}/g;
const action_reg = /@\w+/g;
const full_action_reg = /@\w+="\w+"/g;
const tag_update_reg = /@\w+/g;

export function updateTemplate(component: any) {
    const newDom = compileRealDom(component as HTMLElement, component.stringTemplate);
    const newElements = newDom.content.querySelectorAll('*');
    const elements = component.root.querySelectorAll('*');
    elements.forEach((element: Element, i: number) => {
        if(!element.children.length && element.innerHTML !== newElements.item(i).innerHTML) {
            element.innerHTML = newElements.item(i).innerHTML;
        }
    })
}

export function compileRealDom(currElement: HTMLElement, template: string) {
    const html = document.createElement('template');
    let templateCopy = template;
    const matches = templateCopy.match(props_reg);
    if (matches) {
        const m = matches.map(str => str.slice(2, str.length - 1));
        matches.forEach((e: string, i: number) => {
            templateCopy = templateCopy.replace(e, (currElement as any)[m[i]])
        })
    }
    html.innerHTML = templateCopy;
    return html;
}

export function addActions(component: any) {
    const listOfElements = component.root.querySelectorAll('*');

    listOfElements.forEach((element: Element) => {
        let attrs = element.attributes;
        for (let i = 0; i < attrs.length; i++) {
            const attr = attrs.item(i);
            if (attr) {
                if (attr.name.match(action_reg)) {
                    const event = attr.name.slice(1);
                    const key = attr.value;

                    if (!!component[key]) {
                        element.addEventListener(event, component[key].bind(component))
                    }
                    element.removeAttribute(attr.name);
                }
            }
        }
    })
}