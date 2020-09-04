import { IElementRepresentation, ICtorStyle } from './../interfaces/interfaces';
/**
 * Create Style Elements
 *
 * @param {IElementRepresentation[]}
 *
 * @return {ICtorStyle}
 */
export declare function ExFStylize(children: IElementRepresentation[]): {
    styles: any;
    content: any;
};
/**
 * Compare old and new style content and return commit function
 *
 * @param {ICtorStyle} style
 * @param {IElementRepresentation[]} rep
 *
 * @return {Function}
 */
export declare function extractStyleChanges(style: ICtorStyle, rep: IElementRepresentation[]): {
    rep: any;
    commit: () => void;
};
