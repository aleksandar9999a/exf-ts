import { IElementRepresentation, ICtorStyle, ICtorStyleChange } from './../interfaces/interfaces';

/**
 * Create Style Elements
 * 
 * @param {IElementRepresentation[]}
 *
 * @return {ICtorStyle}
 */
export function ExFStylize(children: IElementRepresentation[]) {
	const content = createStyleContent(children);
	const styles = content.map((text: string) => {
		const style = document.createElement('style');
		style.textContent = text;
		return style;
	})
	
	return { styles, content };
}

/**
 * Create text content for style element
 * 
 * @param {IElementRepresentation[]}
 *
 * @return {String[]}
 */
function createStyleContent(children: IElementRepresentation[]) {
	const allStyles = children.reduce((arr: any, child) => {
		if(typeof child === 'string') {
			if(arr.length > 0) {
				arr[arr.length - 1] += ' }';
			}

			arr.push(`${(child as string).trim()} {`);
		} else {
			Object.keys(child).forEach(key => {
				arr[arr.length - 1] += ` ${key}: ${(child as any)[key]};`
			})
		}

		return arr;
	}, []);

	allStyles[allStyles.length - 1] += ' }';

	return allStyles;
}

/**
 * Compare old and new style content and return commit function
 * 
 * @param {ICtorStyle} style
 * @param {IElementRepresentation[]} rep
 *
 * @return {Function}
 */
export function extractStyleChanges(style: ICtorStyle, rep: IElementRepresentation[]) {
	const { styles, content } = style;
	const newStyles = createStyleContent(rep);
	const changes: ICtorStyleChange[] = [];

	newStyles.forEach((text: string, i: number) => {
		if(text !== content[i]) {
			changes.push({ element: styles[i], content: text });
		}
	})

	return {
		rep: newStyles,
		commit: () => {
			changes.forEach(({ element, content }) => {
				element.textContent = content;
			})
		}
	}
}
