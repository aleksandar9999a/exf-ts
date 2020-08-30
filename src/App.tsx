import ExF, { Component, State, Ref, Watch, Style } from './packages';

@Component({
	selector: 'exf-app'
})
export class App {
	@State
	_stars = Array(3).fill({ 'background-position-x': 0, 'background-position-y': 0 })

	asteroid!: HTMLElement;
	spaceship!: any;

	_step = 20;

	_actions: { [key: string]: Function } = {
		ArrowUp: () => {
			this._stars = this._stars.map((star, i) => {
				return { 
					...star, 
					'background-position-y': star['background-position-y'] + i + 1
				}
			})
			this._spaceshipParams = { 
				...this._spaceshipParams, 
				top: this._spaceshipParams.top - this._step,
				direction: 'up'
			}
		},
		ArrowDown: () => {
			this._stars = this._stars.map((star, i) => {
				return { 
					...star, 
					'background-position-y': star['background-position-y'] - i + 1
				}
			})

			this._spaceshipParams = { 
				...this._spaceshipParams, 
				top: this._spaceshipParams.top + this._step,
				direction: 'down'
			}
		},
		ArrowLeft: () => {
			this._stars = this._stars.map((star, i) => {
				return { 
					...star, 
					'background-position-x': star['background-position-x'] + i + 1
				}
			})
			this._spaceshipParams = { 
				...this._spaceshipParams, 
				left: this._spaceshipParams.left - this._step,
				direction: 'left' 
			}
		},
		ArrowRight: () => {
			this._stars = this._stars.map((star, i) => {
				return { 
					...star, 
					'background-position-x': star['background-position-x'] - i + 1
				}
			})
			this._spaceshipParams = {
				...this._spaceshipParams, 
				left: this._spaceshipParams.left + this._step,
				direction: 'right' 
			}
		},
	}

	@State
	_spaceshipParams = {
		top: 0,
		left: 0,
		engine: false,
		direction: 'right'
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
			this._spaceshipParams = { ...this._spaceshipParams, engine: false };
			return;
		}

		this._spaceshipParams = { ...this._spaceshipParams, engine: true };

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
					top={this._spaceshipParams.top} 
					left={this._spaceshipParams.left} 
					engine={this._spaceshipParams.engine} 
					direction={this._spaceshipParams.direction}
				/>

				<exf-asteroid />
			</div>
		)
	}
}
