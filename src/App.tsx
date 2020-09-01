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
	animateStars() {
		if(!this.engine) {
			return;
		}

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

		requestAnimationFrame(this.animateStars.bind(this))
	}


	connectedCallback() {
		document.addEventListener('keydown', this.handleKeyPress.bind(this))
	}

	handleKeyPress(e: any) {
		if(typeof this._actions[e.code] === 'function') {
			this.animate(this._actions[e.code]);
		}
	}

	detectCollision() {
		return false;
	}

	animate(action: Function) {
		if (this.detectCollision()) {
			this.engine = false;
			return;
		}

		action();
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
				/>

				<exf-asteroid />
			</div>
		)
	}
}
