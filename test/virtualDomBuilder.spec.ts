import { elementParser, representationParser, extractChanges } from './../packages/virualDomBuilder/virtualDomBuilder';

describe('Virtual Dom Builder tests', () => {
	describe('Element Parser', () => {
		test('Expect to create Text Node with content - test', () => {
			const el = elementParser('test');

			expect(el.textContent).toEqual('test');
		})

		test('Expect to create HTML Div Element with content - test', () => {
			const el = elementParser({ tag: 'div', props: {}, children: ['test' as any] });

			expect(el.textContent).toEqual('test');
		})
	})

	describe('Eepresentation Parser', () => {
		test('Expect to create HTML Div Element with content - test', () => {
			const el = representationParser({ tag: 'div', props: {}, children: ['test' as any] });

			expect(el.textContent).toEqual('test');
		})

		test('Expect to create HTML Div Element with attribute class', () => {
			const el = representationParser({ tag: 'div', props: { className: 'test' }, children: [] });

			expect(el.getAttribute('class')).toEqual('test');
		})

		test('Expect to create HTML Div Element with inline-style', () => {
			const el = representationParser({ tag: 'div', props: { style: { background: '#fff' } }, children: [] });

			expect(el.style.background).toEqual('rgb(255, 255, 255)');
		})

		test('Expect to create HTML Div Element with 2 children', () => {
			const rep = {
				tag: 'div',
				props: {},
				children: [
					{ tag: 'button', props: {}, children: [] },
					{ tag: 'p', props: {}, children: [ 'test' as any ] }
				]
			}

			const el = representationParser(rep);

			expect(el.childNodes.length).toEqual(2);
		})
	})

	describe('Extract Changes', () => {
		test('Expect to extract array with 1 commit function', () => {
			const rep = {
				tag: 'ul',
				props: {},
				children: [
					{ tag: 'li', props: {}, children: [ 'test1' as any ] }
				]
			}

			const rep2 = {
				tag: 'ul',
				props: {},
				children: [
					{ tag: 'li', props: {}, children: [ 'test1' as any ] },
					{ tag: 'li', props: {}, children: [ 'test2' as any ] }
				]
			}

			const el = representationParser(rep);

			expect(extractChanges(el, [rep], [rep2]).length).toEqual(1);
		})
	})
})
