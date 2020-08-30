import { App } from './App'
import SpaceShip  from './components/SpaceShip';
import Star  from './components/Star';
import Asteroid  from './components/Asteroid';
import { ExFModule } from './packages';


ExFModule({
	components: [
		SpaceShip,
		Star,
		Asteroid,
		App,
	],
	bootstraps: [
		App
	],
	root: 'app'
})
