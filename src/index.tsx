import { App } from './App'
import Rocket  from './components/Rocket';
import { ExFModule } from './packages';


ExFModule({
	components: [
		App,
		Rocket
	],
	bootstraps: [
		App
	],
	root: 'app'
})
