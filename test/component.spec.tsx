import ExF, { Component, CustomElement, Props, State } from './../packages/index';

describe('ExF tests', () => {
	describe('Custom Element', () => {
		test('Expect to create element with selector exf-test', () => {
			@CustomElement({
				selector: 'exf-test'
			})
			class Test extends Component {
				render() {
					return <div></div>
				}
			}

			expect((Test.prototype as any).selector).toEqual('exf-test');
		})

		test('Expect to create custom element', () => {
			@CustomElement({
				selector: 'exf-test2'
			})
			class Test extends Component {
				render() {
					return <div></div>
				}
			}

			const el = new Test();

			expect(el).toBeTruthy();
		})

		test('Expect element to have property "test"', () => {
			@CustomElement({
				selector: 'exf-test3'
			})
			class Test extends Component {
				@Props() test: string = 'test';

				render() {
					return <div></div>
				}
			}

			const el = new Test();

			expect(el.getAttribute('test')).toEqual('test');
		})

		test('Expect element to have state "test"', () => {
			@CustomElement({
				selector: 'exf-test4'
			})
			class Test extends Component {
				@State() test: string = 'test';

				render() {
					return <div></div>
				}
			}

			const el = new Test();

			expect((el as any)._state.test).toEqual('test');
		})

		test('Expect element with have prop with value "test" and change to "work"', () => {
			@CustomElement({
				selector: 'exf-test5'
			})
			class Test extends Component {
				@Props() test: string = 'test';

				render() {
					return <div>{this.test}</div>
				}
			}

			const el = new Test();

			el.setAttribute('test', 'work');
			expect(el.getAttribute('test')).toEqual('work');
		})
	})
})