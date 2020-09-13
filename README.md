<p align="center">
	<img src="https://firebasestorage.googleapis.com/v0/b/exf-ts.appspot.com/o/logo-exf.png?alt=media&token=37da74eb-d4bc-4a4d-83a2-5b283fa8374d" height="200" />
</p>

<h1 align="center">ExF - TS</h1>

<p align="center">ExF - TS is TypeScript/JavaScript Library for building Custom Web Components. Its purpose is to refine Web Components and present a cool way for their composing.</p>

<br><br>

<h2 align="center">Introduction</h2>

<p align="center">
In the next few lines I will list some of the features that ExF combines to gain his super powers.
</p>

<br><br>

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - This is a technology with which help I manage to combine the super powers of technologies listed below.

- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) - Important part of ExF is encapsulation and here the Shadow DOM intervenes.

- [Virtual DOM](https://bitsofco.de/understanding-the-virtual-dom/) - To make things easier, more sustainable and more dynamic, ExF uses Virtual Dom and updates only what is necessary.

- Virtual Styles - This is not something you could find on Google. Since it turned out to be great to be able to generate a Elements and then update them dynamically, so why not do the same with Styles?

- [TSX](https://www.typescriptlang.org/docs/handbook/jsx.html) - It's actually JSX.

- [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) - When I saw decorators for first time they seemed rather strange to me. But this doesn't make them bad.

- etc...

<br />

<h2 align="center">API</h2>

<br />

<div align="center">

| Decorators | Desctiption |
| --- | --- |
| Custom Element | Indicate class as ExF Component |
| Prop | Creates a property that serves as input for data |
| State | Create state property - change => update DOM |
| Ref | Get reference to HTML Element in current component |  

</div>

<br><br>

<h2 align="center">How to install ExF</h2>

<br />

<p>It is easy. You just need to have configured project, preferably with yarn, TypeScript and Webpack, after that you just run:</p>

```bash
	yarn add exf-ts
```

<br/><br/>

<h2 align="center">Documentation</h2>

<br/>

<h3>Basic Component</h3>

<p>
	Let's look at the following code:
</p>

```javascript
	import ExF, { CustomElement, Component } from 'exf-ts';

	@CustomElement({
		selector: 'exf-app'
	})
	class App extends Component {
		stylize() {
			return (
				<style>
					app {
						{
							'background': '#000'
						}
					}
				</style>
			)
		}

		render() {
			return (
				<div className="app">
					App
				</div>
			)
		}
	}
```
<p>
Yes, that's enough to create a custom element.

For now, our component consists of a few very simple ingredients:

- @CustomElement - That is the decorator who tells on our app that this is actually a custom element and his tag name is the selector. The selector must include "-", it must also be unique.

- Component - The basic class that defines most of the super powers of ExF.

- stylize - The method who gives us the ability to make our styles dynamic.

- render - The method who gives us the ability to make html dynamic. We must always have this method in our component.
</p>

<br />

<h3>Prop</h3>

```javascript
	import ExF, { CustomElement, Component, Prop } from 'exf-ts';

	@CustomElement({
		selector: 'exf-app'
	})
	class App extends Component {
		@Prop() top: number = 0;
		@Prop('style') bg: string = '#fff';
		@Prop('state') name: string = 'ExF';

		stylize() {
			return (
				<style>
					app {
						{
							top: `${this.top}px`
						}
					}
					
					app {
						{
							'background': this.bg
						}
					}
				</style>
			)
		}

		render() {
			return (
				<div className="app">
					<h1>{this.name}</h1>

					<p>Current position is: {this.top}px</p>
				</div>
			)
		}
	}
```

```javascript
	<exf-app name={'ExF'} top={20} bg={'#fff'} />
```

<p>
Тhe example shows us what is Prop and how we can use it. In short - these are attributes through which we can import data into our components. They also trigger DOM and Style updates.

If you've noticed we have three different Props. The difference between them is in the option they have accepted. 

- @Prop() - Trigger Style and DOM update
- @Prop('style') - Trigger only Style update
- @Prop('state') - Trigger only DOM update
</p>

<br />

<h3>State</h3>

```javascript
	import ExF, { CustomElement, Component, State } from 'exf-ts';

	@CustomElement({
		selector: 'exf-app'
	})
	class App extends Component {
		@State() top: number = 0;
		@State('style') bg: string = '#fff';
		@State('state') name: string = 'ExF';

		stylize() {
			return (
				<style>
					app {
						{
							top: `${this.top}px`
						}
					}
					
					app {
						{
							'background': this.bg
						}
					}
				</style>
			)
		}

		render() {
			return (
				<div className="app">
					<h1>{this.name}</h1>

					<p>Current position is: {this.top}px</p>
				</div>
			)
		}
	}
```

<p>
Тhe example shows us what State is and how we can use it. It is like Prop, just they are external state.

- @State() - Trigger Style and DOM update
- @State('style') - Trigger only Style update
- @State('state') - Trigger only DOM update
</p>

<br />

<h3>Ref</h3>


```javascript
	import ExF, { CustomElement, Component, Prop } from 'exf-ts';

	@CustomElement({
		selector: 'exf-app'
	})
	class App extends Component {
		@Ref({ id: 'app' }) app!: HTMLElement;

		stylize() {
			return (
				<style>
					app {
						{
							'background': '#fff'
						}
					}
				</style>
			)
		}

		render() {
			return (
				<div id="app" className="app">
					App
				</div>
			)
		}
	}
```

<p>
	@Ref({ id: 'app' }) works like document.getElementById('app'). It just get reference to element. The components are encapsulated, which means that @Ref only works within the component.
</p>

<br />

<h3>The End of Basics</h3>

<p>Everything is ok so far, but you may still be wondering how the hell I can run this component.</p>

<p>It is simple: </p>

```javascript
	const app = new App();

	document.body.appendChild(app);
```

Or:

```javascript
	const app = document.createElement('exf-app');

	document.body.appendChild(app);
```

Or: 

```javascript
	<exf-app />
```

<br /><br />

<h2 align="center">Deep Dive</h2>

<p align="center">Coming Soon!</p>

<br /><br /><br />

<h4 align="center">Thank you for reading this long long documentation. Maybe you've already got your super powers?</h4>
