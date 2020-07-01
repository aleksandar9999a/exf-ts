import { IStyleItem } from "../interfaces/interfaces";

export function createStyles(list: IStyleItem[]) {
    const stylesSheet = new CSSStyleSheet();
    list.forEach(({ selector, styles }) => {
        styles.forEach(style => {
            Object.keys(style).forEach(key => {
                stylesSheet.addRule(selector, `${key}: ${style[key]}`);
            })
        })
    })
    return stylesSheet;
}