import ExF, { Component, Watch, Props, Style } from '../packages';

@Component({
	selector: 'exf-star'
})
export default class Star {
	@Props
	position = {
		'background-position-x': 0, 
		'background-position-y': 0
	}

	stylize() {
		return (
			<style>
				.star {
					{
						'z-index': '0',
						'background-image': 'url(/assets/stars-3.png)',
						'background-repeat': 'repeat',
						'background-position-y': '0',
						'background-position-x': '0',
						'background-size': '400px',

						'position': 'absolute',
						'top': '0',
						'left': '0',
						'bottom': '0',
						'right': '0',
					}
				}

				.star {
					{ 
						'background-position-x': this.position['background-position-x'] + 'px' 
					}
				}

				.star {
					{ 
						'background-position-y': this.position['background-position-y'] + 'px' 
					}
				}
			</style>
		)
	}

	render() {
		return (
			<div className="star"></div>
		)
	}
}
