import { IElementRepresentation } from './../interfaces/interfaces';
/**
 * Parse HTML Representation
 *
 * @param {IElementRepresentation} representation
 *
 * @returns {HTMLElement}
 */
export declare function representationParser({ tag, props, children }: IElementRepresentation): HTMLElement;
/**
 * Extract changes and return commit function
 *
 * @param {NodeListOf<ChildNode>} childNodes
 * @param {IElementRepresentation} firstRep
 * @param {IElementRepresentation} secondRep
 *
 * @returns {() => updateHTML()}
 */
export declare function extractChanges(childNodes: NodeListOf<ChildNode>, firstRep: IElementRepresentation, secondRep: IElementRepresentation): () => void;
