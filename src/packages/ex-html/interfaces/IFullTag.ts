import ITag from "./ITagEvent";

export default interface IFullTag {
    tag: string,
    events: ITag[],
    attributes: ITag[]
}