import { createStyleContent } from './virtualStyleBuilder';

describe('Virtual Style Bilder - createStyleContent', () => {
	test('Expect to return empty array', () => {
		const res = createStyleContent([]);
		expect(res).toEqual([]);
	})

	test('Expect fn([ ".app", { "background": "#fff", "color": "#000" } ]) to return [ ".app { background: #fff; color: #000; }" ]', () => {
		const res = createStyleContent([ '.app', { 'background': '#fff', 'color': '#000' } ]);
		expect(res).toEqual(['.app { background: #fff; color: #000; }']);
	})

	test('Expect fn([ ".app", { "background": "#fff", "color": "#000" }, ".app", { "background": "#fff", "color": "#000" } ]) to return [ ".app { background: #fff; color: #000; }", ".app { background: #fff; color: #000; }" ]', () => {
		const res = createStyleContent([ '.app', { 'background': '#fff', 'color': '#000' }, '.app', { 'background': '#fff', 'color': '#000' } ]);
		expect(res).toEqual(['.app { background: #fff; color: #000; }', '.app { background: #fff; color: #000; }']);
	})

	test('Expect fn([ ".app", { ul: { "background": "#fff", "color": "#000" } } ]) to return [ ".app ul { background: #fff; color: #000; }" ]', () => {
		const res = createStyleContent([ ".app", { ul: { "background": "#fff", "color": "#000" } } ]);
		const expected = [ ".app ul { background: #fff; color: #000; }" ];

		expect(res).toEqual(expected);
	})

	test('Expect fn([ ".app", { ul: { "background": "#fff", "color": "#000" }, li: { display: "inline-block" } } ]) to return  [ ".app ul { background: #fff; color: #000; }", ".app li { display: inline-block; }" ]', () => {
		const res = createStyleContent([ ".app", { ul: { "background": "#fff", "color": "#000" }, li: { display: "inline-block" } } ]);
		const expected = [ ".app ul { background: #fff; color: #000; }", ".app li { display: inline-block; }" ];

		expect(res).toEqual(expected);
	})

	test('Expect fn([ ".app", { ul: { "background": "#fff", "color": "#000" }, li: { display: "inline-block" }, display: "flex" } ]) to return [ ".app { display: flex; }", ".app ul { background: #fff; color: #000; }", ".app li { display: inline-block; }" ]', () => {
		const res = createStyleContent([ ".app", { ul: { "background": "#fff", "color": "#000" }, li: { display: "inline-block" }, display: "flex" } ]);
		const expected = [ ".app { display: flex; }", ".app ul { background: #fff; color: #000; }", ".app li { display: inline-block; }" ];

		expect(res).toEqual(expected);
	})

	test('Expect fn([ ".app", { ul: { "background": "#fff", "color": "#000" }, li: { display: "inline-block" }, display: "flex" } ]) to return [".app ul { background: #fff; color: #000; }", ".app li a { display: inline-block; }" ]', () => {
		const res = createStyleContent([ ".app", { ul: { "background": "#fff", "color": "#000" }, li: { a: { display: 'inline-block'} } }]);
		const expected = [".app ul { background: #fff; color: #000; }", ".app li a { display: inline-block; }" ];

		expect(res).toEqual(expected);
	})
})
