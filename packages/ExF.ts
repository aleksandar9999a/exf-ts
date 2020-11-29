import { IElementRepresentation } from "./interfaces/interfaces"

/**
 * ExF - Default JSX Engine
 *
 * @param {String} tag
 * @param {Any} props
 * @param {Array} children
 *
 * @returns {Object}
 */
export function ExF(tag: string, props: any, ...childs: (string | IElementRepresentation)[]) {
	const children = childs
		.reduce((acc: (string | IElementRepresentation)[], x) => {
			if (x === null) {
				return acc
			}

			if (Array.isArray(x)) {
				return [...acc, ...x]
			}

			acc.push(x)
			return acc
		}, [])

	return {
		tag,
		props: props || {},
		children
	};
}