import IFullTag from "./interfaces/IFullTag";
import IExtractParams from "./interfaces/IExtractParams";
import uid from 'uid';
import IGenerateTag from "./interfaces/IGenerateTag";

const event_regex = /@[\w]+=/g;
const attr_regex = /&[\w]+=/g;
const id_regex = /id="[\w]+"/g;
const tag_regex = /<\w+[^>]*/g;
const text_regex = /\w+/g;

function extractParams(tag: string) {
    let result: IExtractParams = { tag };

    const tags = result.tag.match(tag_regex);
    if (tags) {
        const lastTag = tags[tags.length - 1];
        const indexOfLastTag = result.tag.indexOf(lastTag);
        result.tag = result.tag.slice(indexOfLastTag);
    }

    const events = result.tag.match(event_regex);
    if (events) {
        const lastEvent = events[events.length - 1];
        const indexOfLastEvent = result.tag.indexOf(lastEvent);
        result.tag = result.tag.slice(0, indexOfLastEvent) + result.tag.slice(indexOfLastEvent + lastEvent.length);
        result.event = lastEvent.slice(1, lastEvent.length - 1);
    }

    const attrs = result.tag.match(attr_regex);
    if (attrs) {
        const lastAttr = attrs[attrs.length - 1];
        const indexOfLastAttr = result.tag.indexOf(lastAttr);
        result.tag = result.tag.slice(0, indexOfLastAttr) + result.tag.slice(indexOfLastAttr + lastAttr.length);
        result.attribute = lastAttr.slice(1, lastAttr.length - 1);
    }

    const id: Array<string> | null = result.tag.match(id_regex);
    if (id) {
        const idText = id[id.length - 1].match(text_regex);
        if (idText) {
            const text = idText[idText.length - 1]
            result.id = text.slice(1, text.length - 1);
        }
    }

    return result;
}

function generateTag(fullTag: string, expression: unknown) {
    let { id, tag, event, attribute } = extractParams(fullTag);
    const index = fullTag.lastIndexOf(tag);
    let result: IGenerateTag = { tag: fullTag.slice(0, index) + tag, attributes: [], events: [] };

    if (attribute === 'id') {
        id = expression as string;
    }

    if (expression != undefined && !id && (!!event || !!attribute)) {
        id = uid();
        result.tag += `id=${id}`;
    }

    if (expression != undefined && !event && !attribute) {
        result.tag += expression;
    }

    if (attribute && expression != undefined && id) {
        result.tag += `${attribute}="${expression}"`;
        result.attributes.push({ id, name: attribute, value: expression });
    }
    if (event && typeof expression === 'function' && id) {
        result.events.push({ id, name: event, value: expression })
    }

    return result;
}

function HTMLSourceFactory(expressions: unknown[], reducedTag: IFullTag, currStr: string, index: number) {
    const currTag = reducedTag.tag + currStr;
    const { tag, attributes, events } = generateTag(currTag, expressions[index]);

    reducedTag.tag = tag;
    reducedTag.attributes = [...reducedTag.attributes, ...attributes];
    reducedTag.events = [...reducedTag.events, ...events];

    return reducedTag;
}

export function createHTMLSource(strings: TemplateStringsArray, ...exprs: unknown[]) {
    const htmlSource = strings.reduce(HTMLSourceFactory.bind(undefined, exprs), { tag: '', events: [], attributes: [] });
    const template = document.createElement('template');
    template.innerHTML = htmlSource.tag;

    return { template, events: htmlSource.events, attributes: htmlSource.attributes };
}
