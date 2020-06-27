export interface IHTMLRepresentation {
    tag: string, 
    attributes: NamedNodeMap,
    childrens: IHTMLRepresentation[], 
    content: string
}