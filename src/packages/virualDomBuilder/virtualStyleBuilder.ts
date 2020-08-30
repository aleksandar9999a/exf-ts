import { IElementRepresentation } from './../interfaces/interfaces';

/**
 * Create Style Element
 * 
 * @param {IElementRepresentation}
 *
 * @return {HTMLElement}
 */
export function ExFStylize({ tag, children }: IElementRepresentation) {
	const style = document.createElement(tag);

	style.textContent = createStyleContent(children);
	
	return style;
}

/**
 * Create text content for style element
 * 
 * @param {IElementRepresentation[]}
 *
 * @return {String}
 */
function createStyleContent(children: IElementRepresentation[]) {
	return children.reduce((text, child) => {
		if(typeof child === 'string') {
			return `${text} ${text.length > 0 ? '}' : ''} ${child} {`
		}

		Object.keys(child).forEach(key => {
			text += `${key}: ${(child as any)[key]};`
		})

		return text;
	}, '') + '}';
}

/**
 * Compare old and new style content and return commit function
 * 
 * @param {HTMLElement}
 * @param {IElementRepresentation[]}
 *
 * @return {Function}
 */
export function extractStyleChanges(style: HTMLElement, rep: IElementRepresentation[]) {
	const currStyles = style.textContent;
	const newStyles = createStyleContent(rep);

	return currStyles === newStyles
		? () => {}
		: () => {
			style.textContent = newStyles;
		}
}
