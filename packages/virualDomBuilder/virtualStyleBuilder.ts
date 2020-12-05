import { IElementRepresentation, ICtorStyle } from './../interfaces/interfaces';

/**
 * Create Style Elements
 *
 * @param {IElementRepresentation[]} children
 *
 * @return {ICtorStyle}
 */
export function ExFStylize(children: IElementRepresentation[]) {
	let content: string[] = [];
	let styles: HTMLStyleElement[] = [];

	if (typeof children[0] === 'object' && children[0].tag === 'style') {
		children.forEach(child => {
			addStyleContentToContainer(content, child.children);
			addStylesToContainer(styles, content[content.length - 1]);
		})
	} else {
		addStyleContentToContainer(content, children);
		addStylesToContainer(styles, content[content.length - 1]);
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
	container.push(styleText)
	return container
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
	container.push(styleEl)
	return container
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
 * @param {ChildNode} parent
 * @param {ICtorStyle} style
 * @param {IElementRepresentation[]} rep
 *
 * @return {Function}
 */
export function extractStyleChanges(parent: ChildNode, style: ICtorStyle, rep: IElementRepresentation[]) {
	let { styles, content } = style;
	const newStyles = ExFStylize(rep);

	let changes: Function[] = [];

	content.forEach((text: string, i: number) => {
		if (text !== newStyles.content[i]) {
			changes = [
				...changes,
				() => styles[i].textContent = newStyles.content[i]
			]
		}
	})

	if (styles.length < newStyles.styles.length) {
		const index = styles.length;
		const newItems = newStyles.styles.slice(index);
		const newContent = newStyles.content.slice(index);

		styles = [...styles, ...newItems];
		content = [...content, ...newContent];

		changes = [
			...changes,
			() => newItems.forEach(item => parent.appendChild(item))
		]
	}

	return {
		rep: { styles, content: newStyles.content },
		commit: changes
	};
}
