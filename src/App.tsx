import ExF, { Component, State, Ref, Watch, Style } from './packages';

@Component({
	selector: 'exf-app'
})
export class App {
	@State
	_stars = Array(3).fill({ 'background-position-x': 0, 'background-position-y': 0 })

	asteroid!: HTMLElement;
	spaceship!: any;

	@State
	engine = false;

	@State
	direction = 'right';

	@State
	left = 0;

	@State
	top = 0;

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
		if(!this.engine || this.detectCollision()) {
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

	connectedCallback() {
		document.addEventListener('keydown', this.handleKeyPress.bind(this))
	}

	handleKeyPress(e: any) {
		if(typeof this._actions[e.code] === 'function') {
			this._actions[e.code]();
		}
	}

	detectCollision() {
		this.engine = false;
		return false;
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
