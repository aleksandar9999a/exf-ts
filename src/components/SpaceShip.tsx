import ExF, { Component, Watch, Props, Style } from '../packages';

@Component({
	selector: 'exf-spaceship'
})
export default class SpaceShip {
	_directionsMap: { [key: string]: number } = {
		up: 0,
		right: 90,
		left: -90,
		down: 180
	}

	@Props
	direction = '';

	@Style
	left = 0;

	@Style
	top = 0;

	@Props
	engine = false;


	@Watch('engine')
	animate() {
		if(this.direction === 'right') {
			this.left = this.left + 1;
		}

		if(this.direction === 'left') {
			this.left = this.left - 1;
		}

		if(this.direction === 'up') {
			this.top = this.top - 1;
		}

		if(this.direction === 'down') {
			this.top = this.top + 1;
		}

		if(this.engine) {
			requestAnimationFrame(this.animate.bind(this));
		}
	}
	
	stylize() {
		const left = this.left + 'px';
		const top = this.top + 'px';
		const engine = this.engine
			? { 'background-position': '-210px 0px' }
			: { 'background-position': '0px 0px' }

		const direction = { 'transform': `rotate(${this._directionsMap[this.direction]}deg)` }

		return (
			<style>
				div {
					{
						'display': 'block',
						'position': 'absolute',
						'height': '210px',
						'width': '210px',

						'box-sizing': 'border-box',
						'background-color': 'rgba(255, 0, 0, .5)',
						'background-repeat': 'no-repeat',
						'background-size': '420px 210px',
				
						'transition-delay': '0s',
						'transition-duration': '50ms',
						'transition-property': 'transform',
						'transition-timing-function': 'linear',
					
						'background-image': 'url(/assets/ship-sprite.gif)'
					}
				}

				div {
					direction
				}

				div {
					{ left }
				}

				div {
					{ top }
				}

				div {
					engine
				}
			</style>
		)
	}

	render() {
		return <div></div>;
	}

}
