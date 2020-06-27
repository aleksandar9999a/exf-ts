const props_reg = /\${\w+}/g;
const action_reg = /@\w+/g;

export function replaceProps(template: string, props: { [key: string]: any }) {
    const html = document.createElement('template');
    
    let templateCopy = template;
    const matchedStr = template.match(props_reg);

    if (matchedStr) {
        const m = matchedStr.map(str => str.slice(2, str.length - 1));
        matchedStr.forEach((e: string, i: number) => {
            templateCopy = template.replace(e, props[m[i]])
        })
    }

    html.innerHTML = templateCopy;
    return html;
}

export function addActions(this:any, elements: NodeListOf<Element>, actions: { [key: string]: any }) {
    elements.forEach(e => {
        const attrs = e.attributes;
        for (let i = 0; i < attrs.length; i++) {
            const element = attrs[i];
            if (element.name.match(action_reg)) {
                const event = element.name.slice(1);
                const key = element.value;
                if (!!actions[key]) {
                    
                    e.addEventListener(event, actions[key].bind(this))
                }
                e.removeAttribute(element.name);
            }
        }
    })
}