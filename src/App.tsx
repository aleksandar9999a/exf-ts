import ExF, { Component, State, Ref, Watch, Style } from './packages';

@Component({
	selector: 'exf-app'
})
export class App {
	green = 'green';

	@Ref({ id: 'pesho' })
	ref!: HTMLElement;

	@Watch('list')
	handler(newValue: any, oldValue: any) {

	}

	@Style
	customStyle = {
		'background-color': 'red'
	}

	@State
	className = 'wrapper';
	
	@State
	name = 'alex';

	@State
	list: string[] = ['i','i','i'];


	handleClick(e: any) {
		this.list = [...this.list, 'ivaneeee'];
	}

	handleRemove = (e: any) => {
		this.list = this.list.slice(0, this.list.length - 1)
	}

	handleClassName = (e: any) => {
		this.className = 'container';
	}

	handleInput = (e: any) => {
		this.name = e.target.value;
	}

	handleSubmit = () => {
		this.list = [...this.list, this.name];
		this.name = '';
	}

	handleRocket = () => {
		console.log('rocket')
	}

	handleStyle = () => {
		this.customStyle = {
			['background-color']: 'black' 
		};
	}

	log() {
		console.log('work');
	}

	stylize() {
		return (
			<style>
				.list {
					this.customStyle
				}

				.wrapper {
					{
						'background-color': 'yellow',
						'color': 'green'
					}
				}
			</style>
		)
	}

	render() {
		return (
			<div id="ivan" className={this.className}>
				<exf-rocket items={this.list} />

				<div style={{ backgroundColor: 'black' }}>
					<button onClick={this.handleClick.bind(this)}>Add Item</button>

					<button onClick={this.handleRemove}>Remove Item</button>

					<button onClick={this.handleClassName}>Change className</button>

					<button onClick={this.handleSubmit}>Submit</button>

					<button onClick={this.handleStyle}>Style</button>
				</div>

				<input value={this.name} onInput={this.handleInput} />

				<div id="pesho">
					<p className={this.className}>{this.name}</p>
				</div>
				
				<ul className="list">
					{this.list.map(item => {
						return <li>{item}</li>
					})}
				</ul>
			</div>
		)
	}
}
