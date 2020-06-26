import ITag from "./ITagEvent";

export default interface ITemplateResult {
    template: HTMLTemplateElement;
    events: ITag[];
    attributes: ITag[];
}