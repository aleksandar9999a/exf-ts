import ITag from "./ITagEvent";

export default interface IGenerateTag {
    tag: string, 
    attributes: ITag[], 
    events:ITag[]
}