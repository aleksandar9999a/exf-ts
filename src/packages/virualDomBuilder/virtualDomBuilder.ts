import { IElementRepresentation } from "./../interfaces/interfaces";

function nonNull(val: any, fallback: any) {
    return !!val
        ? val
        : fallback
};

function childrenParser(children: any) {
    return children.map((child: any) => {
        if (typeof child === 'string') {
            return document.createTextNode(child);
        }
        return representationParser(child);
    })
}

export function representationParser({ tag, props, children }: IElementRepresentation) {
    const el = document.createElement(tag);
    Object.keys(nonNull(props, {})).forEach((key: any) => {
        (el as any)[key] = props[key];
    })
    childrenParser(children).forEach((child: any) => {
        el.appendChild(child);
    });
    return el;
}

export function ExF(tag: string | Function, props: any, ...children: (string | IElementRepresentation)[]) {
    if (typeof tag === 'function') {
        return tag({
            ...nonNull(props, {}),
            children
        });
    }
    return { tag, props, children };
}
