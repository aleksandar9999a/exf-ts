import ExF, { Component, State, Ref, Watch, Style } from './packages';

@Component({
	selector: 'exf-app'
})
export class App {
	@State
	_stars = Array(3).fill({ 'background-position-x': 0, 'background-position-y': 0 })

	@State
	engine = false;

	@State
	direction = 'right';

	@State
	left = 0;

	@State
	top = 0;

	_asteroid = {
		width: 100,
		height: 100,
		top: 250,
		left: 300
	}

	_spaceship = {
		width: 210,
		height: 210
	}

	_actions: { [key: string]: Function } = {
		ArrowUp: () => {
			this.direction = 'up';
		},
		ArrowDown: () => {
			this.direction = 'down';
		},
		ArrowLeft: () => {
			this.direction = 'left';
		},
		ArrowRight: () => {
			this.direction = 'right';
		},
		Space: () => {
			this.engine = !this.engine;
		}
	}

	@Watch('engine') 
	animate() {
		if(!this.engine) {
			return;
		}

		const collision = this.detectCollision(this._asteroid, { ...this._spaceship, top: this.top, left: this.left });

		if(collision) {
			this.engine = false;
			return;
		}

		this.animateStars();
		this.animateSpaceShip();

		requestAnimationFrame(this.animate.bind(this))
	}

	animateStars() {
		const position = this.direction === 'right' || this.direction === 'left'
			? `background-position-x`
			: `background-position-y`

		this._stars = this._stars.map((star, i) => {
			if(this.direction === 'right' || this.direction === 'down') {
				return {
					...star,
					[position]: star[position] - i - 1
				}
			}

			return {
				...star,
				[position]: star[position] + i + 1
			}
		})
	}

	animateSpaceShip() {
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
	}

	detectCollision(o1: { top: number, left: number, width: number, height: number }, o2: { top: number, left: number, width: number, height: number }) {
		const o2L = o2.left + o2.width / 1.25;
		const o2T = o2.top + o2.height / 1.25;
		const o1L = o1.left + o1.width;
		const o1T = o1.top + o1.height;

		return o2L >= o1.left && o2T >= o1.top && o1L >= o2.left && o1T >= o2.top;
	}
	
	connectedCallback() {
		document.addEventListener('keydown', this.handleKeyPress.bind(this))
	}

	handleKeyPress(e: any) {
		if(typeof this._actions[e.code] === 'function') {
			this._actions[e.code]();
		}
	}

	stylize() {
		return (
			<style>
				.wrapper {
					{
						background: '#000',
						width: '100vw',
						height: '100vh'
					}
				}

				.star + .star {
					{
						'background-size': '500px'
					}
				}

				.stas + .star + .star {
					{
						'background-size': '700px'
					}
				}
			</style>
		)
	}

	render() {
		return (
			<div id="wrapper" className="wrapper">
				{
					this._stars.map(star => {
						return <exf-star position={star} />
					})
				}

				<exf-spaceship
					engine={this.engine} 
					direction={this.direction}
					left={this.left}
					top={this.top}
				/>

				<exf-asteroid />
			</div>
		)
	}
}
