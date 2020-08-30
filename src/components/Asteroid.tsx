import ExF, { Component, Style } from '../packages';

interface IAsteroidParams { 
	width?: string, 
	height?: string,
	background?: string, 
	position?: string, 
	top?: string, 
	left?: string 
}

@Component({
	selector: 'exf-asteroid'
})
export default class Asteroid {
	@Style
	_basicStyle = {
		background: 'cyan',
		position: 'absolute',
		width: '100px',
	    height: '100px',
	    top: '250px',
	    left: '300px'
	}

	stylize() {
		return (
			<style>
				div {
					this._basicStyle
				}
			</style>
		)
	}

	render() {
		return <div></div>
	}

}
