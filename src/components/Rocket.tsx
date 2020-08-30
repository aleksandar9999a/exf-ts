import ExF, { Component, State, Props } from '../packages';

@Component({
	selector: 'exf-rocket'
})
export default class Rocket {

	@Props
	items: string[] = [];

	render() {
		return (
			<div>
				{this.items.map(item => {
					return <p>{item}</p>;
				})}
			</div>
		)
	}
}
