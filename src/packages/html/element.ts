import { IHTMLRepresentation } from "./interfaces";

function createNode(elements: HTMLCollection) {
    let rep: IHTMLRepresentation[] = [];
    for (let i = 0; i < elements.length; i++) {
        let currNode: IHTMLRepresentation = { tag: '', attributes: [] as any, childrens: [], content: '' };
        const currEl = elements.item(i);
        currNode.tag = currEl!.tagName;
        currNode.attributes = currEl!.attributes;


        if (currEl?.hasChildNodes()) {
            currEl.childNodes.forEach(el => {
                if (el.nodeName === '#text') {
                    currNode.content = el.nodeValue!;
                }
            })

            const child = createNode(currEl.children)
            currNode.childrens = child;
        }

        rep.push(currNode);
    }
    return rep;
}

export function createRep(html: string) {
    const temp = document.createElement('template');
    temp.innerHTML = html;

    return createNode(temp.content.children);
}