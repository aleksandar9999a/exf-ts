import { IElementRepresentation, ICtorStyle, ICtorStyleChange } from './../interfaces/interfaces';

/**
 * Create Style Elements
 *
 * @param {IElementRepresentation[]} children
 * @param {Boolean} isCreateStyles
 *
 * @return {ICtorStyle}
 */
export function ExFStylize(children: IElementRepresentation[], isCreateStyles: boolean = true) {
	let content: string[] = [];
	let styles: HTMLStyleElement[] = [];

	if (typeof children[0] === 'object' && children[0].tag === 'style') {
		children.forEach(child => {
			content = addStyleContentToContainer(content, child.children);

			if (isCreateStyles) {
				styles = addStylesToContainer(styles, content[content.length - 1]);
			}
		})
	} else {
		content = addStyleContentToContainer(content, children);

		if (isCreateStyles) {
			styles = addStylesToContainer(styles, content[content.length - 1]);
		}
	}
	
	return { styles, content };
}

/**
 * Add style content to container
 * 
 * @param {string[]} container 
 * @param {IElementRepresentation[]} children 
 * 
 * @returns {string[]}
 */
function addStyleContentToContainer(container: string[], children: IElementRepresentation[]) {
	const styleText = createStyleContent(children).join(' ');
	return [...container, styleText]
}

/**
 * Add Styles to container
 * 
 * @param {HTMLStyleElement[]} container 
 * @param {String} text
 * 
 * @returns {HTMLStyleElement[]}
 */
function addStylesToContainer(container: HTMLStyleElement[], text: string) {
	const styleEl = document.createElement('style');
	styleEl.textContent = text;
	return [...container, styleEl]
}

/**
 * Create text content for style element
 *
 * @param { (Object | String)[]} children
 *
 * @return {String[]}
 */
export function createStyleContent(children: (object | string)[]) {
	const allStyles = children.reduce((arr: any, child) => {
		if (typeof child === 'string') {
			arr.push(`${(child as string).trim()} {`);
		} else if (arr[arr.length - 1].includes('@media') || arr[arr.length - 1].includes('@keyframes')) {
			Object.keys(child).forEach((key) => {
				createStyleContent([key, (child as any)[key]]).forEach((s: string) => {
					arr[arr.length - 1] += s;
				})
			});

			arr[arr.length - 1] += ' }';
			const indexOfOpen = arr[arr.length - 1].indexOf('{');
			const indexOfClose = arr[arr.length - 1].indexOf('}');

			if (indexOfClose - indexOfOpen < 3) {
				arr = arr.slice(0, arr.length - 1);
			}
		} else {
			const lastEl = arr[arr.length - 1] as string;

			const indexOfOpen = lastEl.indexOf('{');
			const lastSelector = lastEl.slice(0, indexOfOpen).trim();

			let concatedStyles: string[] = [];

			Object.keys(child).forEach((key) => {
				if (typeof (child as any)[key] === 'object') {
					const styles = createStyleContent([`${lastSelector} ${key}`, (child as any)[key]]);
					concatedStyles = [...concatedStyles, ...styles];
				} else {
					arr[arr.length - 1] += ` ${key}: ${(child as any)[key]};`;
				}
			});

			arr[arr.length - 1] += ' }';
			const indexOfClose = arr[arr.length - 1].indexOf('}');

			arr = indexOfClose - indexOfOpen < 3
				? [...arr.slice(0, arr.length - 1), ...concatedStyles]
				: [...arr, ...concatedStyles];
		}

		return arr;
	}, []);

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
	const newStyles = ExFStylize(rep, false);
	const changes: ICtorStyleChange[] = [];

	newStyles.content.forEach((text: string, i: number) => {
		if (text !== content[i]) {
			changes.push({ element: styles[i], content: text });
		}
	});

	return {
		rep: newStyles.content,
		commit: () => {
			changes.forEach(({ element, content }) => {
				element.textContent = content;
			});
		},
	};
}
